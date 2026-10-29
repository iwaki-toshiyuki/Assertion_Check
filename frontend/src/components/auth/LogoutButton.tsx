"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth/logout";

// ログアウトボタンの表示・状態管理・ログアウト処理を担当する
export default function LogoutButton() {
  const router = useRouter();

  // ログアウト処理中の状態とエラーを管理する
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ログアウトボタンを押したときの処理
  const handleLogout = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Cognitoのログアウト処理を実行する
      await logoutUser();

      // ログアウト完了後、ログイン画面へ移動する
      router.replace("/login");
      router.refresh();
    } catch (error) {
      // ログアウトに失敗した場合はエラーを表示する
      setError(
        error instanceof Error
          ? error.message
          : "ログアウトに失敗しました。",
      );
    } finally {
      // ログアウト処理の終了後、ローディング状態を解除する
      setIsLoading(false);
    }
  };

  return (
    <div className="shrink-0">
      {/* ログアウトボタン */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="whitespace-nowrap rounded bg-gray-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50 sm:px-4 sm:py-2 sm:text-base"
      >
        {isLoading ? "ログアウト中..." : "ログアウト"}
      </button>

      {/* エラーメッセージ */}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}