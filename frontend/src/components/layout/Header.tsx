import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

// ログイン後の各画面で共通表示するヘッダー。
export default function Header() {
  return (
    <header className="border-b border-emerald-100 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
        {/* アプリ名をクリックするとホーム画面へ戻る */}
        <Link
          href="/"
          className="min-w-0 truncate text-base font-bold text-emerald-800 sm:text-lg"
        >
          🍀 アサーションCheck
        </Link>

        {/* どの画面からでもログアウトできるようにする */}
        <LogoutButton />
      </div>
    </header>
  );
}