"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth/login";

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

      // ログイン成功時はトップページへ移動する
      if (result.isSignedIn) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* メールアドレス入力 */}
      <div>
        <label htmlFor="email" className="mb-1 block">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {/* パスワード入力 */}
      <div>
        <label htmlFor="password" className="mb-1 block">
          パスワード
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {/* エラーメッセージ */}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* ログインボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {isLoading ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}