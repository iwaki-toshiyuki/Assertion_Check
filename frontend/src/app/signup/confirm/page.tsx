import { Suspense } from "react";
import Link from "next/link";
import ConfirmSignUpForm from "@/components/auth/ConfirmSignUpForm";

// メール認証画面のレイアウトを担当する
export default function ConfirmSignUpPage() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">メール認証</h1>

      <p className="mb-6 text-sm text-gray-600">
        登録したメールアドレスに届いた確認コードを入力してください。
      </p>

      {/* URLのクエリパラメータ取得が完了するまで待機する */}
      <Suspense fallback={<p>読み込み中...</p>}>
        <ConfirmSignUpForm />
      </Suspense>

      {/* 新規登録画面・ログイン画面へ戻るリンク */}
      <div className="mt-6 flex justify-center gap-6 text-sm">
        <Link
          href="/signup"
          className="font-semibold text-emerald-700 hover:underline"
        >
          新規登録に戻る
        </Link>
        <Link
          href="/login"
          className="font-semibold text-emerald-700 hover:underline"
        >
          ログイン画面へ
        </Link>
      </div>
    </main>
  );
}