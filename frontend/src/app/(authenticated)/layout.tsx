import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/layout/Header";

// ログイン後の画面に共通ヘッダーと認証チェックを適用する。
export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-emerald-50">
        {/* 共通ヘッダー */}
        <Header />

        {/* 各ページ固有の内容 */}
        {children}
      </div>
    </AuthGuard>
  );
}