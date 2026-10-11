import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// Cognitoのユーザー情報を取得するクライアント
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION ?? "ap-northeast-1",
});

// アクセストークンを使ってCognitoからユーザー名を取得する
export async function getCognitoNickname(
  accessToken: string,
): Promise<string> {
  // 認証済みユーザーの情報を取得する
  const command = new GetUserCommand({
    AccessToken: accessToken,
  });

  const response = await cognitoClient.send(command);

  // ユーザー属性からnicknameを取得する
  const nickname = response.UserAttributes?.find(
    (attribute) => attribute.Name === "nickname",
  )?.Value;

  // nicknameが取得できなかった場合はエラーにする
  if (!nickname) {
    throw new Error("Cognitoからユーザー名を取得できませんでした");
  }

  return nickname;
}