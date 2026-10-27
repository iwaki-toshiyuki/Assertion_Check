// アサーションと3つのコミュニケーションタイプを説明する画面
export default function AssertionGuidePage() {
  return (
    <main className="min-h-full bg-emerald-50">
      <div className="mx-auto max-w-2xl px-4 pb-12 sm:px-6">
        {/* ページタイトル */}
        <header className="pt-8 pb-6 sm:pt-10">
          <h1 className="text-2xl font-bold text-emerald-900">
            アサーションとは
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            自分も相手も大切にするコミュニケーション
          </p>
        </header>

        <div className="space-y-6">
          {/* アサーションの概要 */}
          <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-emerald-900">
              アサーションとは？
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-700">
              アサーションとは、自分の気持ちや考えを大切にしながら、
              相手の気持ちや考えも尊重して伝えるコミュニケーションの考え方です。
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-700">
              自分の意見を我慢することでも、相手に一方的に押し付けることでもありません。
              お互いを尊重しながら、自分の考えを適切に伝えることを目指します。
            </p>
          </section>

          {/* 3つのコミュニケーションタイプ */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-emerald-900">
              3つのコミュニケーションタイプ
            </h2>

            <div className="space-y-4">
              {/* アサーティブ */}
              <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="font-bold text-emerald-700">
                  ① アサーティブ
                </h3>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  自分も相手も尊重するタイプ
                </p>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  自分の気持ちや意見を率直に伝えながら、
                  相手の立場や考えにも配慮するコミュニケーションです。
                </p>
              </article>

              {/* アグレッシブ */}
              <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="font-bold text-orange-600">
                  ② アグレッシブ
                </h3>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  自分の主張を優先するタイプ
                </p>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  自分の意見や要求を強く押し出し、
                  相手の気持ちや立場への配慮が不足しやすいコミュニケーションです。
                </p>
              </article>

              {/* ノンアサーティブ */}
              <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="font-bold text-blue-600">
                  ③ ノンアサーティブ
                </h3>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  自分の気持ちを抑えやすいタイプ
                </p>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  相手の意見や要求を優先し、
                  自分の気持ちや考えを十分に伝えられないコミュニケーションです。
                </p>
              </article>
            </div>
          </section>

          {/* 具体例 */}
          <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-emerald-900">
              具体例で比較してみよう
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-700">
              例えば、上司から急な仕事を頼まれたものの、
              すでに別の仕事で手がいっぱいだった場合を考えてみましょう。
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-emerald-700">
                  アサーティブ
                </h3>
                <p className="mt-2 rounded-lg bg-emerald-50 p-4 text-sm leading-7 text-gray-700">
                  「今は別の業務を進めているため、
                  すぐに対応するのは難しい状況です。
                  どちらを優先すべきか相談させていただけますか？」
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-orange-600">
                  アグレッシブ
                </h3>
                <p className="mt-2 rounded-lg bg-orange-50 p-4 text-sm leading-7 text-gray-700">
                  「今忙しいんですけど！
                  そんな仕事まで押し付けないでください！」
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-blue-600">
                  ノンアサーティブ
                </h3>
                <p className="mt-2 rounded-lg bg-blue-50 p-4 text-sm leading-7 text-gray-700">
                  「はい、わかりました……。」
                  （本当は余裕がないものの、断れずに引き受ける）
                </p>
              </div>
            </div>
          </section>

          {/* まとめ */}
          <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-emerald-900">
              アサーションを身につけるために
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-700">
              アサーティブな伝え方は、最初から上手にできる必要はありません。
              日々のコミュニケーションを振り返り、
              少しずつ練習していくことが大切です。
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-700">
              アサーションCheckでは、実際に困った場面と自分の対応を入力することで、
              コミュニケーションの傾向を振り返り、
              よりアサーティブな伝え方を考えることができます。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}