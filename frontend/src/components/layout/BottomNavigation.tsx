"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ログイン後の各画面で共通表示する下部ナビゲーション。
export default function BottomNavigation() {
  const pathname = usePathname();

  const navigationItems = [
    { label: "ホーム", href: "/" },
    { label: "新規作成", href: "/analysis/new" },
    { label: "マイページ", href: "/mypage" },
  ];

  return (
    <nav className="border-t border-emerald-100 bg-white">
      <div className="mx-auto flex max-w-2xl justify-around">
        {navigationItems.map((item) => {
          // 現在のURLと一致するメニューを選択状態にする。
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex-1 py-4 text-center text-sm font-medium ${
                isActive
                  ? "text-emerald-700"
                  : "text-gray-500 hover:text-emerald-600"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}