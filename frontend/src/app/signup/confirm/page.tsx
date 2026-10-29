import { Suspense } from "react";
import Link from "next/link";
import ConfirmSignUpForm from "@/components/auth/ConfirmSignUpForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

// メール認証画面のレイアウトを担当する
export default function ConfirmSignUpPage() {
  return (
    <AuthPageLayout
      title="メール認証"
      description="登録したメールアドレスに届いた確認コードを入力してください。"
      footer={
        // 新規登録画面・ログイン画面へ戻るリンク
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
      }
    >
      {/* URLのクエリパラメータ取得が完了するまで待機する */}
      <Suspense
        fallback={<p className="text-center text-gray-800">読み込み中...</p>}
      >
        <ConfirmSignUpForm />
      </Suspense>
    </AuthPageLayout>
  );
}
