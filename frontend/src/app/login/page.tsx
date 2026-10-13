import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

// ログイン画面のレイアウトを担当する
export default function LoginPage() {
  return (
    <AuthPageLayout
      title="ログイン"
      description="メールアドレスとパスワードを入力してください。"
      footer={
        // 新規登録画面へのリンク
        <p>
          アカウントをお持ちでない方は
          <Link
            href="/signup"
            className="ml-1 font-semibold text-emerald-700 hover:underline"
          >
            新規登録
          </Link>
        </p>
      }
    >
      {/* ログインフォームを表示する */}
      <LoginForm />
    </AuthPageLayout>
  );
}
