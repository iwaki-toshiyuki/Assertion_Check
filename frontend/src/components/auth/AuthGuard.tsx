"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/lib/auth/current-user";

// AuthGuardで保護する子コンポーネントの型
type AuthGuardProps = {
  children: ReactNode;
};

// 認証状態に応じてページの表示を制御する
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  // 認証状態の確認結果を管理する
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    // Cognitoから現在のログイン状態を取得する
    const checkAuth = async () => {
      try {
        const user = await fetchCurrentUser();

        if (!isActive) return;

        // 未ログインの場合はログイン画面へ移動する
        if (!user) {
          router.replace("/login");
          return;
        }

        // ログイン済みの場合のみページ表示を許可する
        setIsAuthenticated(true);
      } catch (error) {
        if (!isActive) return;

        console.error("認証状態の確認に失敗しました:", error);
        setError("認証状態を確認できませんでした。");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void checkAuth();

    // アンマウント後に状態を更新しないようにする
    return () => {
      isActive = false;
    };
  }, [router]);

  // 認証状態の取得に失敗した場合
  if (error) {
    return <p role="alert">{error}</p>;
  }

  // 認証確認中、または未ログインの場合はページを表示しない
  if (isLoading || !isAuthenticated) {
    return <p>認証状態を確認しています...</p>;
  }

  // ログイン済みの場合のみ子コンポーネントを表示する
  return <>{children}</>;
}