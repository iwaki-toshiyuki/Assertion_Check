import { getCurrentUser } from "aws-amplify/auth";

// 現在ログインしているユーザーの情報を取得する
export async function fetchCurrentUser() {
  try {
    // ログイン中のユーザー情報を取得する
    const user = await getCurrentUser();

    return user;
  } catch (error) {
    // 未ログインの場合はnullを返す
    if (
      error instanceof Error &&
      error.name === "UserUnAuthenticatedException"
    ) {
      return null;
    }

    // その他のエラーは呼び出し元に伝える
    throw error;
  }
}