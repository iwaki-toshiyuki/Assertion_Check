import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

// 新規登録画面のレイアウトを担当する
export default function SignUpPage() {
  return (
    <AuthPageLayout
      title="新規登録"
      description="アカウントを作成して、コミュニケーションを振り返りましょう。"
      footer={
        // ログイン画面へのリンク
        <p>
          アカウントをお持ちの方は
          <Link
            href="/login"
            className="ml-1 font-semibold text-emerald-700 hover:underline"
          >
            ログイン
          </Link>
        </p>
      }
    >
      {/* 新規登録フォームを表示する */}
      <SignUpForm />
    </AuthPageLayout>
  );
}
