import type { ReactNode } from "react";

// 認証画面（ログイン・新規登録・メール認証）の共通レイアウトに必要な値を受け取る。
type AuthPageLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

// 認証画面で共通利用する背景・見出し・カード形式の入力エリアを表示する。
export default function AuthPageLayout({
  title,
  description,
  children,
  footer,
}: AuthPageLayoutProps) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-emerald-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        {/* アプリ名 */}
        <p className="mb-8 text-center text-2xl font-bold text-emerald-800 sm:text-3xl">
          🍀 アサーションCheck
        </p>

        {/* 画面タイトル */}
        <header className="mb-6 text-center">
          <h1 className="text-xl font-bold text-emerald-900">{title}</h1>

          {description && (
            <p className="mt-2 text-sm text-gray-800">{description}</p>
          )}
        </header>

        {/* 入力エリア */}
        <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </section>

        {/* 他の認証画面へのリンク */}
        {footer && (
          <div className="mt-6 text-center text-sm text-gray-800">{footer}</div>
        )}
      </div>
    </main>
  );
}
