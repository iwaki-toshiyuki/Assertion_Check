"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth/login";
import { syncDbUser } from "@/lib/api/users";

// ログインフォームの表示・入力管理・送信処理を担当する
export default function LoginForm() {
  const router = useRouter();

  // フォームの入力値を管理する
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ログイン処理の状態とエラーメッセージを管理する
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ログインボタンを押したときの処理
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      // Cognitoにログインをリクエストする
      const result = await loginUser({ email, password });

      // Cognitoログイン成功後、DBユーザーを取得・作成する
      if (result.isSignedIn) {
        await syncDbUser();

        // DB連携完了後にトップページへ移動する
        router.push("/");
        return;
      }

      // 追加の認証手順が必要な場合
      if (result.nextStep.signInStep === "CONFIRM_SIGN_UP") {
        router.push(`/signup/confirm?email=${encodeURIComponent(email)}`);
        return;
      }

      setError("追加の認証手順が必要です。");
    } catch (error) {
      // Cognitoから返されたエラーを表示する
      setError(
        error instanceof Error
          ? error.message
          : "ログインに失敗しました。",
      );
    } finally {
      // 成功・失敗にかかわらずローディング状態を解除する
      setIsLoading(false);
    }
  };

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
        disabled={isLoading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isLoading ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}