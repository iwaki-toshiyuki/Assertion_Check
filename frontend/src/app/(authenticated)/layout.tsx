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
      <div className="flex h-dvh flex-col overflow-hidden bg-emerald-50">
        {/* 画面上部に常時表示する共通ヘッダー */}
        <div className="z-10 shrink-0">
          <Header />
        </div>

        {/* この領域だけをスクロール可能にする */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>

        {/* 画面下部に常時表示するナビゲーション */}
        <div className="z-10 shrink-0">
          <BottomNavigation />
        </div>
      </div>
    </AuthGuard>
  );
}