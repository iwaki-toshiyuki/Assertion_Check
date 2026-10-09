import { confirmSignUp } from "aws-amplify/auth";

// メール認証時に必要な入力情報
type ConfirmSignUpInput = {
  email: string;
  confirmationCode: string;
};

// Cognitoに確認コードを送信し、ユーザー登録を確定する
export async function confirmUserSignUp({
  email,
  confirmationCode,
}: ConfirmSignUpInput) {
  const result = await confirmSignUp({
    // 新規登録時に使用したメールアドレス
    username: email,

    // メールで受信した確認コード
    confirmationCode,
  });

  return result;
}