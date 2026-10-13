"use client";

import { useEffect, useState } from "react";
import { syncDbUser } from "@/lib/api/users";
import type { DbUser } from "@/lib/api/users";
import { fetchCurrentUserEmail } from "@/lib/auth/current-user";

// マイページにユーザー情報とメニューを表示する
export default function MyPage() {
  const [user, setUser] = useState<DbUser | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // DBとCognitoからユーザー情報を取得する
    const loadUserProfile = async () => {
      try {
        const [dbUser, userEmail] = await Promise.all([
          syncDbUser(),
          fetchCurrentUserEmail(),
        ]);

        if (isMounted) {
          setUser(dbUser);
          setEmail(userEmail);
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);

        if (isMounted) {
          setErrorMessage("ユーザー情報の取得に失敗しました。");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // 登録日を日本語形式で表示する
  const formattedCreatedAt = user
    ? new Date(user.createdAt).toLocaleDateString("ja-JP")
    : "";

  return (
    <main className="min-h-screen bg-emerald-50">
      <div className="mx-auto max-w-2xl">
       {/* ページタイトル */}
        <header className="px-6 pt-10 pb-6">
          <h1 className="text-2xl font-bold text-emerald-900">
            マイページ
          </h1>
        </header>

        <div className="px-6 py-8">
          {/* ローディング */}
          {isLoading && (
            <p className="text-gray-600">
              ユーザー情報を取得しています...
            </p>
          )}

          {/* エラー */}
          {errorMessage && (
            <p role="alert" className="text-red-600">
              {errorMessage}
            </p>
          )}

          {/* ユーザー情報 */}
          {!isLoading && !errorMessage && user && (
            <div className="space-y-8">
              <section className="flex items-center gap-4 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
                {/* ユーザーアイコン */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-700"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                  </svg>
                </div>

                {/* ユーザー情報 */}
                <div className="min-w-0">
                  <p className="font-bold text-gray-800">
                    {user.username}
                  </p>

                  <p className="break-all text-sm text-gray-600">
                    {email ?? "メールアドレス未設定"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    登録日：{formattedCreatedAt}
                  </p>
                </div>
              </section>

              {/* メニュー */}
              <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">
                    アサーションとは
                  </span>

                  <span
                    className="text-xl text-gray-400"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}