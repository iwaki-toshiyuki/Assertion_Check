import { Suspense } from "react";
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
    </main>
  );
}