import SignUpForm from "@/components/auth/SignUpForm";

// 新規登録画面のレイアウトを担当する
export default function SignUpPage() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">新規登録</h1>

      {/* 新規登録フォームを表示する */}
      <SignUpForm />
    </main>
  );
}