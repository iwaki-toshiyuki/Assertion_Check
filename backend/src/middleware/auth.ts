import { CognitoJwtVerifier } from "aws-jwt-verify";
import { createMiddleware } from "hono/factory";
import { env } from "../env";

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
export const authMiddleware = createMiddleware(async (c, next) => {
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

  try {
    // Cognitoの公開鍵を使用してJWTを検証する
    await verifier.verify(token);

    // JWTが有効な場合は次の処理へ進む
    await next();
  } catch (error) {
    // 無効・期限切れなどのJWTは受け付けない
    console.error("JWT検証に失敗しました:", error);

    return c.json(
      { error: "認証に失敗しました" },
      401,
    );
  }
});