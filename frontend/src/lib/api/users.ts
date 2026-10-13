import { fetchAuthSession } from "aws-amplify/auth";
import { env } from "@/lib/env";

// DBに保存されているユーザー情報の型
export type DbUser = {
  id: number;
  username: string;
  createdAt: string;
};

// Cognito認証済みユーザーとDBユーザーを連携する
export async function syncDbUser(): Promise<DbUser> {
  // Cognitoからアクセストークンを取得する
  const session = await fetchAuthSession();
  const accessToken = session.tokens?.accessToken?.toString();

  if (!accessToken) {
    throw new Error("認証情報を取得できませんでした");
  }

  // JWTを付与してDBユーザーの取得・作成APIを呼び出す
  const response = await fetch(`${env.apiBaseUrl}/api/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("DBユーザーの連携に失敗しました");
  }

  // DBユーザー情報を返す
  const user: DbUser = await response.json();

  return user;
}