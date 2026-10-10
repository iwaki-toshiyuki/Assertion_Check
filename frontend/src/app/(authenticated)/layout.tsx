import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";

// 認証済みユーザー向け画面の共通レイアウト。
export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-emerald-50">
        {/* 全画面共通のヘッダー */}
        <Header />

        {/* ページごとのコンテンツ */}
        <div className="flex-1">{children}</div>

        {/* 全画面共通の下部ナビゲーション */}
        <BottomNavigation />
      </div>
    </AuthGuard>
  );
}