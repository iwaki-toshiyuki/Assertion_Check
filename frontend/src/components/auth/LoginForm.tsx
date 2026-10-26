"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth/login";
import { syncDbUser } from "@/lib/api/users";
import { fetchCurrentUser } from "@/lib/auth/current-user";

type AuthStatus = "checking" | "signedOut" | "syncing" | "syncError" | "redirecting" | "authError";

// ログインフォームの表示・入力管理・送信処理を担当する
export default function LoginForm() {
  const router = useRouter();

  // フォームの入力値を管理する
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 認証状態を管理する
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");

  // エラーメッセージを管理する
  const [error, setError] = useState("");

  // 二重送信を防止する
  const isSubmittingRef = useRef(false);

  // ログイン処理中の表示を管理する
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    // ログイン済みユーザーのDB連携を確認する
    const checkAuth = async () => {
      try {
        const user = await fetchCurrentUser();

        if (!isActive) return;

        if (!user) {
          setAuthStatus("signedOut");
          return;
        }

        setAuthStatus("syncing");

        try {
          await syncDbUser();

          if (!isActive) return;

          setAuthStatus("redirecting");
          router.replace("/");
        } catch (error) {
          if (!isActive) return;

          console.error("DB連携に失敗しました:", error);
          setError("DBユーザーの連携に失敗しました。再試行してください。");
          setAuthStatus("syncError");
        }
      } catch (error) {
        if (!isActive) return;

        console.error("認証状態の確認に失敗しました:", error);
        setError("認証状態を確認できませんでした。");
        setAuthStatus("authError");
      }
    };

    void checkAuth();

    return () => {
      isActive = false;
    };
  }, [router]);

  // DB連携を再試行する
  const handleRetrySync = async () => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setError("");
    setAuthStatus("syncing");

    try {
      await syncDbUser();

      setAuthStatus("redirecting");
      router.replace("/");
    } catch (error) {
      console.error("DB連携の再試行に失敗しました:", error);
      setError("DBユーザーの連携に失敗しました。再試行してください。");
      setAuthStatus("syncError");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // ログインボタンを押したときの処理
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingRef.current || authStatus !== "signedOut") return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      // Cognitoにログインをリクエストする
      const result = await loginUser({ email, password });

      if (result.isSignedIn) {
        setAuthStatus("syncing");

        try {
          // Cognitoログイン成功後、DBユーザーを取得・作成する
          await syncDbUser();

          setAuthStatus("redirecting");
          router.replace("/");
        } catch (error) {
          console.error("DB連携に失敗しました:", error);
          setError("ログインには成功しましたが、DB連携に失敗しました。再試行してください。");
          setAuthStatus("syncError");
        }

        return;
      }

      // 追加の認証手順が必要な場合
      if (result.nextStep.signInStep === "CONFIRM_SIGN_UP") {
        setAuthStatus("redirecting");
        router.push(`/signup/confirm?email=${encodeURIComponent(email)}`);
        return;
      }

      setError("追加の認証手順が必要です。");
    } catch (error) {
      console.error("ログインに失敗しました:", error);

      setError(
        error instanceof Error
          ? error.message
          : "ログインに失敗しました。",
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // 初回の認証状態確認中
  if (authStatus === "checking") {
    return <p>ログイン状態を確認しています...</p>;
  }

  // DB連携中
  if (authStatus === "syncing") {
    return <p>ユーザー情報を確認しています...</p>;
  }

  // 画面遷移中
  if (authStatus === "redirecting") {
    return <p>画面を移動しています...</p>;
  }

  // DB連携失敗時は再試行ボタンを表示する
  if (authStatus === "syncError") {
    return (
      <div className="space-y-4">
        <p role="alert" className="text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={handleRetrySync}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          DB連携を再試行
        </button>
      </div>
    );
  }

  // 認証状態の確認自体に失敗した場合
  if (authStatus === "authError") {
    return (
      <p role="alert" className="text-red-600">
        {error}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* メールアドレス入力 */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* パスワード入力 */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          パスワード
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* エラーメッセージ */}
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      {/* ログインボタン */}
      <button
        type="submit"
        disabled={authStatus !== "signedOut" || isSubmitting}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isSubmitting ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}