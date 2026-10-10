import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";

// 新規登録画面のレイアウトを担当する
export default function SignUpPage() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">新規登録</h1>

      {/* 新規登録フォームを表示する */}
      <SignUpForm />

      {/* ログイン画面へのリンク */}
      <p className="mt-6 text-center text-sm text-gray-600">
        アカウントをお持ちの方は
        <Link
          href="/login"
          className="ml-1 font-semibold text-emerald-700 hover:underline"
        >
          ログイン
        </Link>
      </p>
    </main>
  );
}
