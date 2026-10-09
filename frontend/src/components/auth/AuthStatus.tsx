"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCurrentUser } from "@/lib/auth/current-user";
import LogoutButton from "@/components/auth/LogoutButton";

// 認証状態に応じて表示するUIを切り替える
export default function AuthStatus() {
  // 認証状態を管理する
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // コンポーネントの破棄後に状態を更新しないためのフラグ
    let isMounted = true;

    // 現在のログイン状態を取得する
    const checkAuthStatus = async () => {
      try {
        const user = await fetchCurrentUser();

        if (isMounted) {
          // ユーザー情報が取得できればログイン中と判定する
          setIsAuthenticated(user !== null);
        }
      } catch {
        if (isMounted) {
          setError("ログイン状態の取得に失敗しました。");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void checkAuthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  // ログイン状態を確認している間はローディングを表示する
  if (isLoading) {
    return <p>ログイン状態を確認しています...</p>;
  }

  // 認証状態の取得に失敗した場合
  if (error) {
    return <p role="alert" className="text-red-600">{error}</p>;
  }

  // ログイン中はログアウトボタンを表示する
  if (isAuthenticated) {
    return <LogoutButton />;
  }

  // 未ログインの場合はログイン画面へのリンクを表示する
  return (
    <Link
      href="/login"
      className="inline-block rounded bg-emerald-600 px-4 py-2 font-semibold text-white"
    >
      ログイン
    </Link>
  );
}