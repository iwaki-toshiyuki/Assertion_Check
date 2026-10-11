import { signUp } from "aws-amplify/auth";

// 新規登録時に必要な入力情報
type SignUpInput = {
  username: string;
  email: string;
  password: string;
};

// Cognitoにユーザーの新規登録をリクエストする
export async function registerUser({
  username,
  email,
  password,
}: SignUpInput) {
  const result = await signUp({
    // Cognitoへのログインにはメールアドレスを使用する
    username: email,
    password,
    options: {
      // メール認証完了後の自動ログインを有効化する
      autoSignIn: true,

      // メールアドレスとアプリ内ユーザー名をCognitoに登録する
      userAttributes: {
        email,
        nickname: username,
      },
    },
  });

  return result;
}