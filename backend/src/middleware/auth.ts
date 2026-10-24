import { CognitoJwtVerifier } from "aws-jwt-verify";
import { createMiddleware } from "hono/factory";
import { env } from "../env";
import type { APIGatewayProxyEventV2WithJWTAuthorizer, } from "aws-lambda";

// 認証後にHonoのコンテキストで共有する情報
export type AuthEnv = {
  Bindings: {
    event?: APIGatewayProxyEventV2WithJWTAuthorizer;
  };
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
    if (env.isLambda) {
      // API Gatewayが検証したJWTクレームを取得する
      const event = c.env?.event;

      const claims = event?.requestContext?.authorizer?.jwt?.claims;

      // 検証済みJWTクレームが存在しない場合は認証失敗
      if (!claims) {
        return c.json({ error: "認証に失敗しました" }, 401);
      }

      // Cognitoのアクセストークンであることを確認する
      if (
        claims.token_use !== "access" ||
        claims.client_id !== env.cognitoAppClientId ||
        typeof claims.sub !== "string" ||
        !claims.sub
      ) {
        return c.json({ error: "認証に失敗しました" }, 401);
      }

      cognitoSub = claims.sub;
    } else {
      // ローカル環境では従来どおりCognitoのJWTを検証する
      const payload = await verifier.verify(token);

      cognitoSub = payload.sub;
    }
  } catch (error) {
    console.error("JWT認証処理に失敗しました:", error);

    return c.json({ error: "認証に失敗しました" }, 401);
  }

  // 認証済みユーザーのIDを後続のAPIに渡す
  c.set("cognitoSub", cognitoSub);

  // Cognitoのユーザー属性取得に使用するアクセストークンを保存する
  c.set("accessToken", token);

  // 認証成功後、次の処理へ進む
  await next();
  });