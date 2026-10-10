// マイページの仮画面。
// ユーザー情報の表示・変更機能は後続のステップで実装する。
export default function MyPage() {
  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-emerald-900">
          マイページ
        </h1>

        <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            ユーザー情報
          </h2>

          <p className="text-sm text-gray-600">
            ユーザー情報の表示・変更機能は、今後実装予定です。
          </p>
        </section>
      </div>
    </main>
  );
}