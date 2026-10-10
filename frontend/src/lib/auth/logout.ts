import { signOut } from "aws-amplify/auth";

// Cognitoのログアウト処理を実行する
export async function logoutUser() {
  await signOut();
}