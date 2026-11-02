"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth/signup";
import PasswordInput from "@/components/auth/PasswordInput";

// 新規登録フォームの表示・入力管理・送信処理を担当する
export default function SignUpForm() {
  const router = useRouter();

  // フォームの入力値を管理する
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 登録処理の状態とエラーメッセージを管理する
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 確認用パスワードと、不一致の場合のエラーメッセージを管理する。
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // 新規登録ボタンを押したときに、入力を確認して登録処理を行う。
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    // フォーム送信時のページ再読み込みを防止する。
    event.preventDefault();

    // 前回の送信時に表示したエラーをリセットする。
    setError("");
    setConfirmPasswordError("");

    // パスワードが一致しない場合は、登録処理を行わず確認欄へ移動する。
    if (password !== confirmPassword) {
      setConfirmPasswordError("パスワードが一致しません。");
      document.getElementById("confirm-password")?.focus();
      return;
    }

    // 一致を確認してから、既存の登録処理を開始する。
    setIsLoading(true);

    try {
      // Cognitoに新規登録をリクエストする
      const result = await registerUser({ username, email, password });

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ユーザー名入力 */}
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          ユーザー名
        </label>
        <input
          id="username"
          type="text"
          autoComplete="nickname"
          required
          maxLength={20}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
        <p className="mt-1 text-xs text-gray-700">
          20文字以内で入力してください。
        </p>
      </div>
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

      {/* 登録するパスワードを入力する。変更時は確認欄のエラーを解除する。 */}
      <PasswordInput
        id="password"
        label="パスワード"
        value={password}
        onChange={(value) => {
          setPassword(value);
          setConfirmPasswordError("");
        }}
        autoComplete="new-password"
        minLength={8}
        hint="8文字以上で、大文字・小文字・数字・記号を含めてください。"
      />

      {/* 入力ミスを防ぐため、同じパスワードを再入力してもらう。 */}
      <PasswordInput
        id="confirm-password"
        label="パスワード（確認）"
        value={confirmPassword}
        onChange={(value) => {
          setConfirmPassword(value);
          setConfirmPasswordError("");
        }}
        autoComplete="new-password"
        minLength={8}
        hint="同じパスワードをもう一度入力してください。"
        error={confirmPasswordError}
      />

      {/* エラーメッセージ */}
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* 新規登録ボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isLoading ? "登録中..." : "新規登録"}
      </button>
    </form>
  );
}