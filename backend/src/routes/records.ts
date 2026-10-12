import { Hono } from "hono";
import { findUserByCognitoSub } from "../db/users.js";
import { findRecordsByUserId } from "../db/records.js";
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

export default records;