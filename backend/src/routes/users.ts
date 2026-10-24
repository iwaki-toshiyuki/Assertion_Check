import { Hono } from "hono";
import { z } from "zod";
import type { AuthEnv } from "../middleware/auth.js";
import {
  findUserByCognitoSub,
  findOrCreateUser,
} from "../db/users.js";

const users = new Hono<AuthEnv>();

// ユーザー同期時に受け取る表示名の入力ルール
const syncUserSchema = z.object({
  username: z.string().trim().min(1).max(20),
});

// 認証済みユーザーの情報をDBから取得する
users.get("/me", async (c) => {
  const cognitoSub = c.get("cognitoSub");

  try {
    const user = await findUserByCognitoSub(cognitoSub);

    // DBにユーザーが登録されていない場合
    if (!user) {
      return c.json(
        { error: "ユーザーが登録されていません" },
        404,
      );
    }

    return c.json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("ユーザー情報の取得に失敗しました:", error);

    return c.json(
      { error: "ユーザー情報の取得に失敗しました" },
      500,
    );
  }
});

// 認証済みユーザーの情報をDBに登録・同期する
users.post("/me", async (c) => {
  const cognitoSub = c.get("cognitoSub");

  // リクエストボディを取得する
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { error: "JSON形式が正しくありません" },
      400,
    );
  }

  // 表示名を検証する
  const result = syncUserSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      { error: "ユーザー名は1〜20文字で入力してください" },
      400,
    );
  }

  try {
    // JWTのsubと表示名を使ってDBユーザーを取得・登録する
    const user = await findOrCreateUser(
      cognitoSub,
      result.data.username,
    );

    return c.json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("ユーザー情報の同期に失敗しました:", error);

    return c.json(
      { error: "ユーザー情報の同期に失敗しました" },
      500,
    );
  }
});

export default users;