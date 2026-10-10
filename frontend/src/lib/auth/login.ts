import { signIn } from "aws-amplify/auth";

// ログイン時に必要な入力情報
type LoginInput = {
  email: string;
  password: string;
};

// Cognitoにメールアドレスとパスワードを送信して認証する
export async function loginUser({ email, password }: LoginInput) {
  const result = await signIn({
    username: email,
    password,
  });

  return result;
}