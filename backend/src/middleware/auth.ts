import { CognitoJwtVerifier } from "aws-jwt-verify";
import { createMiddleware } from "hono/factory";
import { env } from "../env";

// 認証後にHonoのコンテキストで共有する情報
export type AuthEnv = {
  Variables: {
    cognitoSub: string;
    accessToken: string;
  };
};

// JWT検証に必要なCognitoの設定が存在するか確認する
if (!env.cognitoUserPoolId || !env.cognitoAppClientId) {
  throw new Error("Cognitoの環境変数が設定されていません");
}

// Cognitoのアクセストークンを検証するための設定
const verifier = CognitoJwtVerifier.create({
  userPoolId: env.cognitoUserPoolId,
  tokenUse: "access",
  clientId: env.cognitoAppClientId,
});

// CognitoのJWTを検証する認証ミドルウェア
export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  // Authorizationヘッダーを取得する
  const authorization = c.req.header("Authorization");

  // Bearer形式のトークンが存在するか確認する
  if (!authorization?.startsWith("Bearer ")) {
    return c.json(
      { error: "認証トークンがありません" },
      401,
    );
  }

  // Bearerの後ろにあるJWTを取り出す
  const token = authorization.slice(7).trim();

  if (!token) {
    return c.json(
      { error: "認証トークンがありません" },
      401,
    );
  }

  let cognitoSub: string;

  try {
    // Cognitoの公開鍵を使用してJWTを検証する
    const payload = await verifier.verify(token);

    // 検証済みJWTからCognitoユーザーIDを取得する
    cognitoSub = payload.sub;
  } catch (error) {
    console.error("JWT検証に失敗しました:", error);

    return c.json({ error: "認証に失敗しました" }, 401);
  }

  // 認証済みユーザーのIDを後続のAPIに渡す
  c.set("cognitoSub", cognitoSub);

  // Cognitoのユーザー属性取得に使用するアクセストークンを保存する
  c.set("accessToken", token);

  // 認証成功後、次の処理へ進む
  await next();
  });