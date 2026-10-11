import { Hono } from "hono";
import type { AuthEnv } from "../middleware/auth.js";
import { findOrCreateUser } from "../db/users.js";

const users = new Hono<AuthEnv>();

// 認証済みユーザーの情報を取得する
users.get("/me", async (c) => {
  const cognitoSub = c.get("cognitoSub");
  const accessToken = c.get("accessToken");

  // DBに存在すれば取得、存在しなければ新規登録する
  const user = await findOrCreateUser(cognitoSub, accessToken);

  return c.json({
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  });
});

export default users;