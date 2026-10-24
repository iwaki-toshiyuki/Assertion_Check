import {
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth";
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

  // Cognitoからユーザーの表示名を取得する
  const attributes = await fetchUserAttributes();
  const username = attributes.nickname?.trim();

  if (!username) {
    throw new Error("Cognitoからユーザー名を取得できませんでした");
  }

  // JWTと表示名を送信し、DBユーザーを登録・同期する
  const response = await fetch(`${env.apiBaseUrl}/api/users/me`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("DBユーザーの連携に失敗しました");
  }

  // DBユーザー情報を返す
  const user: DbUser = await response.json();

  return user;
}