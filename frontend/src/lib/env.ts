export const env = {
  // Hono APIの接続先
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8787",

  // Amazon Cognitoの設定
  cognitoUserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  cognitoClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
};
