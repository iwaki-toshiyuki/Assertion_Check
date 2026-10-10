export const env = {
  port: Number(process.env.PORT ?? 8787),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",

  // CognitoのJWT検証に利用する設定
  cognitoRegion: process.env.COGNITO_REGION,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  cognitoAppClientId: process.env.COGNITO_APP_CLIENT_ID,
};
