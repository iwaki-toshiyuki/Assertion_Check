import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

// ログイン画面のレイアウトを担当する
export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">ログイン</h1>

      {/* ログインフォームを表示する */}
      <LoginForm />

      {/* 新規登録画面へのリンク */}
      <p className="mt-6 text-center text-sm text-gray-600">
        アカウントをお持ちでない方は
        <Link
          href="/signup"
          className="ml-1 font-semibold text-emerald-700 hover:underline"
        >
          新規登録
        </Link>
      </p>
    </main>
  );
}
