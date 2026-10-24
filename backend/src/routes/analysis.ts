import { Hono } from "hono";
import { analysisRequestSchema } from "../schemas/analysis";
import { analyzeCommunication } from "../services/analysis";
import { saveAnalysis } from "../services/analysis-save";
import { findUserByCognitoSub } from "../db/users.js";
import type { AuthEnv } from "../middleware/auth";
import { consumeAnalysisQuota, getAnalysisUsage, } from "../db/analysis-usage.js";

const analysis = new Hono<AuthEnv>();

// ログインユーザーの本日の分析利用状況を取得する
analysis.get("/usage", async (c) => {
  try {
    // JWT認証済みユーザーのCognito subを取得する
    const cognitoSub = c.get("cognitoSub");

    // PostgreSQLから登録済みユーザーを取得する
    const user = await findUserByCognitoSub(cognitoSub);

    // DBユーザーが存在しない場合は同期を促す
    if (!user) {
      return c.json(
        { error: "ユーザー情報が登録されていません。再ログインしてください。" },
        404,
      );
    }

    // 本日の利用回数と残り回数を取得する
    const usage = await getAnalysisUsage(user.id);

    return c.json(usage);
  } catch (error) {
    console.error("分析利用状況の取得に失敗しました:", error);

    return c.json(
      {
        error: "分析利用状況の取得に失敗しました",
      },
      500,
    );
  }
});

analysis.post("/", async (c) => {
  // リクエストボディをJSONとして読み取る
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json(
      {
        error: "JSON形式が正しくありません",
      },
      400,
    );
  }

  // リクエスト内容が分析APIの入力ルールを満たしているか検証する
  const result = analysisRequestSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        error: "入力内容が正しくありません",
        details: result.error.flatten().fieldErrors,
      },
      400,
    );
  }

  try {
    // JWT認証済みユーザーのCognito subを取得する
    const cognitoSub = c.get("cognitoSub");

    // PostgreSQLから登録済みユーザーを取得する
    const user = await findUserByCognitoSub(cognitoSub);

    // DBユーザーが存在しない場合は同期を促す
    if (!user) {
      return c.json(
        { error: "ユーザー情報が登録されていません。再ログインしてください。" },
        404,
      );
    }

    // Bedrockを呼び出す前に、当日の分析実行枠を1回分確保する
    const canAnalyze = await consumeAnalysisQuota(user.id);

    if (!canAnalyze) {
      return c.json(
        {
          error: "本日の分析回数の上限（10回）に達しました。明日以降に再度お試しください。",
        },
        429,
      );
    }

    // 検証済みの入力内容を使ってBedrockで分析する
    const analysisResult = await analyzeCommunication(result.data);

    // 分析内容と分析結果をPostgreSQLに保存し、保存したレコードIDを取得する
    const { recordId } = await saveAnalysis({
      userId: user.id,
      situation: result.data.situation,
      response: result.data.response,
      analysisResult,
    });

    // 分析結果に保存したレコードIDを追加して返却する
    return c.json({
      ...analysisResult,
      recordId,
    });
  } catch (error) {
    console.error("アサーション分析または保存に失敗しました:", error);

    return c.json(
      {
        error: "分析処理中にエラーが発生しました",
      },
      500,
    );
  }
});

export default analysis;