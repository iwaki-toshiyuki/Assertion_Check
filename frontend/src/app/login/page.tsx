import LoginForm from "@/components/auth/LoginForm";

// ログイン画面のレイアウトを担当する
export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">ログイン</h1>

      {/* ログインフォームを表示する */}
      <LoginForm />
    </main>
  );
}