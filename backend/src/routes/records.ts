import { Hono } from "hono";
import { findUserByCognitoSub } from "../db/users.js";
import { findRecordsByUserId, findRecordByIdAndUserId, } from "../db/records.js";
import type { AuthEnv } from "../middleware/auth.js";

const records = new Hono<AuthEnv>();

// 認証済みユーザーの分析履歴一覧を取得する
records.get("/", async (c) => {
  try {
    // JWT認証で取得したCognitoのユーザーIDを取得する
    const cognitoSub = c.get("cognitoSub");

    // CognitoのsubからDBユーザーを検索する
    const user = await findUserByCognitoSub(cognitoSub);

    // DBにユーザーが存在しない場合は空の履歴一覧を返す
    if (!user) {
      return c.json([]);
    }

    // ログインユーザー自身の分析履歴のみ取得する
    const history = await findRecordsByUserId(user.id);

    return c.json(history);
  } catch (error) {
    console.error("分析履歴の取得に失敗しました:", error);

    return c.json(
      {
        error: "分析履歴の取得中にエラーが発生しました",
      },
      500,
    );
  }
});

// 指定された分析履歴の詳細を取得する
records.get("/:id", async (c) => {
  try {
    // URLから履歴IDを取得する
    const recordId = Number(c.req.param("id"));

    // 履歴IDが正の整数でない場合は400を返す
    if (!Number.isSafeInteger(recordId) || recordId <= 0) {
      return c.json(
        { error: "履歴IDが不正です" },
        400,
      );
    }

    // JWT認証で取得したCognitoのユーザーIDを取得する
    const cognitoSub = c.get("cognitoSub");

    // CognitoのsubからDBユーザーを検索する
    const user = await findUserByCognitoSub(cognitoSub);

    // DBにユーザーが存在しない場合は404を返す
    if (!user) {
      return c.json(
        { error: "分析履歴が見つかりません" },
        404,
      );
    }

    // 履歴IDとログインユーザーIDの両方を条件に検索する
    const record = await findRecordByIdAndUserId(recordId, user.id);

    // 履歴が存在しない、または他ユーザーの履歴の場合は404を返す
    if (!record) {
      return c.json(
        { error: "分析履歴が見つかりません" },
        404,
      );
    }

    return c.json(record);
  } catch (error) {
    console.error("分析履歴の詳細取得に失敗しました:", error);

    return c.json(
      { error: "分析履歴の詳細取得中にエラーが発生しました" },
      500,
    );
  }
});

export default records;