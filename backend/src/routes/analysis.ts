import { Hono } from "hono";
import { analysisRequestSchema } from "../schemas/analysis";
import { analyzeCommunication } from "../services/analysis";
import { saveAnalysis } from "../services/analysis-save";
import { findOrCreateUser } from "../db/users";
import type { AuthEnv } from "../middleware/auth";

const analysis = new Hono<AuthEnv>();

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
    // JWT認証ミドルウェアで取得したCognitoの認証情報を取得する
    const cognitoSub = c.get("cognitoSub");
    const accessToken = c.get("accessToken");

    // Cognitoユーザーに対応するDBユーザーを取得・登録する
    const user = await findOrCreateUser(cognitoSub, accessToken);

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