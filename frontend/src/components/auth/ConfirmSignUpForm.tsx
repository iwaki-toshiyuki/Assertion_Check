"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmUserSignUp } from "@/lib/auth/confirm-signup";
import { autoLoginUser } from "@/lib/auth/auto-login";
import { syncDbUser } from "@/lib/api/users";

// メール認証フォームの表示・入力管理・送信処理を担当する
export default function ConfirmSignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 新規登録画面から渡されたメールアドレスを取得する
  const email = searchParams.get("email") ?? "";

  // 確認コード・認証処理の状態・エラーを管理する
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // メール認証ボタンを押したときの処理
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    try {
    // Cognitoに確認コードを送信する
    const result = await confirmUserSignUp({
      email,
      confirmationCode,
    });

    // メール認証が完了していない場合はエラーを表示する
    if (!result.isSignUpComplete) {
      setError("メール認証を完了できませんでした。");
      return;
    }

    // 自動ログインが必要な場合
    if (result.nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
      try {
        // Cognitoの自動ログイン処理を実行する
        const signInResult = await autoLoginUser();

        // 自動ログイン成功後、DBユーザーを取得・作成する
        if (signInResult.isSignedIn) {
          try {
            await syncDbUser();
          } catch (dbError) {
            // メール認証・Cognitoログインは成功しているため、
            // DB連携の失敗を自動ログイン失敗として扱わない
            console.error("DBユーザーの連携に失敗しました:", dbError);
            setError("メール認証は完了しましたが、ユーザー情報の連携に失敗しました。");
            return;
          }

  // DB連携完了後にホーム画面へ遷移する
  router.replace("/");
  return;
}
      } catch (autoLoginError) {
        // 自動ログインに失敗してもメール認証は完了している
        console.error("自動ログインに失敗しました", autoLoginError);
      }
    }
    // 自動ログインできなかった場合は通常のログイン画面へ移動する
    router.replace("/login");
  } catch (error) {
    // メール認証処理のエラーを画面に表示する
    setError(
      error instanceof Error
        ? error.message
        : "メール認証に失敗しました。",
    );
  } finally {
    // 認証処理の終了後、ローディング状態を解除する
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 認証対象のメールアドレス */}
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
          value={email}
          readOnly
          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-gray-600 outline-none"
        />
      </div>

      {/* メールで受信した確認コード */}
      <div>
        <label
          htmlFor="confirmationCode"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          確認コード
        </label>
        <input
          id="confirmationCode"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          value={confirmationCode}
          onChange={(event) => setConfirmationCode(event.target.value)}
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

      {/* メール認証ボタン */}
      <button
        type="submit"
        disabled={isLoading || !email}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isLoading ? "認証中..." : "メール認証"}
      </button>
    </form>
  );
}