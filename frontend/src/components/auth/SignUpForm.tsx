"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth/signup";

// 新規登録フォームの表示・入力管理・送信処理を担当する
export default function SignUpForm() {
  const router = useRouter();

  // フォームの入力値を管理する
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 登録処理の状態とエラーメッセージを管理する
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 新規登録ボタンを押したときの処理
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // フォーム送信時のページ再読み込みを防止する
    event.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      // Cognitoに新規登録をリクエストする
      const result = await registerUser({ email, password });

      // メール認証が必要な場合は確認コード入力画面へ移動する
      if (result.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        router.push(`/signup/confirm?email=${encodeURIComponent(email)}`);
        return;
      }

      // 登録が完了している場合はログイン画面へ移動する
      if (result.isSignUpComplete) {
        router.push("/login");
        return;
      }

      setError("登録を完了できませんでした。もう一度お試しください。");
    } catch (error) {
      // Cognitoから返されたエラーを画面に表示する
      setError(
        error instanceof Error
          ? error.message
          : "新規登録に失敗しました。",
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
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        <p className="mt-1 text-sm text-gray-600">
          8文字以上で、大文字・小文字・数字・記号を含めてください。
        </p>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* 新規登録ボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {isLoading ? "登録中..." : "新規登録"}
      </button>
    </form>
  );
}