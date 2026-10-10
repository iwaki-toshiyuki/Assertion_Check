import { signUp } from "aws-amplify/auth";

// 新規登録時に必要な入力情報
type SignUpInput = {
  email: string;
  password: string;
};

// Cognitoにユーザーの新規登録をリクエストする
export async function registerUser({ email, password }: SignUpInput) {
  const result = await signUp({
    username: email,
    password,
    options: {
      // メール認証完了後の自動ログインを有効化する
      autoSignIn: true,

      // メールアドレスをユーザー属性として登録する
      userAttributes: {
        email,
      },
    },
  });

  return result;
}