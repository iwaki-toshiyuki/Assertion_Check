import Link from "next/link";

// ホーム画面。
// 分析履歴の取得機能は未実装のため、現段階では空の状態を表示する。
export default function Home() {
  return (
      <main className="min-h-screen bg-emerald-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* 画面タイトル */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-emerald-800">
              アサーションCheck
            </h1>

            <p className="mt-3 text-gray-600">
              これまでの分析結果を振り返りましょう。
            </p>
          </header>

          {/* 新規作成画面へのリンク */}
          <div className="mb-8">
            <Link
              href="/analysis/new"
              className="block rounded-lg bg-emerald-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
            >
              新規作成
            </Link>
          </div>

          {/* 分析履歴一覧：DB実装後に履歴表示へ変更する */}
          <section className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              分析履歴
            </h2>

            <p className="text-gray-600">
              分析履歴はまだありません。
            </p>
          </section>
        </div>
      </main>
  );
}