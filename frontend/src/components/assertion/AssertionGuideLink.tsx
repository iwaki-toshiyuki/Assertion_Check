import Link from "next/link";

// アサーションの説明画面へ誘導する共通コンポーネント
export default function AssertionGuideLink() {
  return (
    <aside className="rounded-lg border border-emerald-200 bg-emerald-100/60 px-4 py-3">
      <p className="text-sm leading-6 text-emerald-900">
        <span aria-hidden="true">💡 </span>
        アサーションについて詳しく知りたい方は、
        <Link
          href="/assertion-guide"
          className="font-semibold underline underline-offset-4 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          「アサーションとは」
        </Link>
        をご覧ください。
      </p>
    </aside>
  );
}