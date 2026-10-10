import { Amplify } from "aws-amplify";
import { env } from "./env";

// Cognitoの設定が不足している場合は初期化を行わない
export function configureAmplify() {
  if (!env.cognitoUserPoolId || !env.cognitoClientId) {
    throw new Error("Cognitoの環境変数が設定されていません");
  }

  // Next.jsからCognitoの認証機能を利用できるようにする
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: env.cognitoUserPoolId,
        userPoolClientId: env.cognitoClientId,
        loginWith: {
          email: true,
        },
      },
    },
  });
}