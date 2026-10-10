import { autoSignIn } from "aws-amplify/auth";

// メール認証完了後にCognitoの自動ログイン処理を実行する
export async function autoLoginUser() {
  const result = await autoSignIn();

  return result;
}