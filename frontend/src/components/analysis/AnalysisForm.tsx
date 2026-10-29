// 分析フォームの表示・操作に必要な値とイベント処理を親コンポーネントから受け取る。
type AnalysisFormProps = {
  situation: string;
  response: string;
  isLoading: boolean;
  errorMessage: string | null;
  canAnalyze: boolean;
  remainingCount: number | null;
  dailyLimit: number;
  onSituationChange: (value: string) => void;
  onResponseChange: (value: string) => void;
  onAnalyze: () => void;
};

// ユーザーの入力内容と分析実行に必要なフォームUIを表示する。
export function AnalysisForm({
  situation,
  response,
  isLoading,
  errorMessage,
  canAnalyze,
  remainingCount,
  dailyLimit,
  onSituationChange,
  onResponseChange,
  onAnalyze,
}: AnalysisFormProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <div className="space-y-6">
        {/* 本日の分析可能回数を表示する */}
        <div
          className={`rounded-lg p-4 text-sm font-medium ${
            remainingCount === 0
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-800"
          }`}
        >
          {remainingCount === null
            ? "本日の分析可能回数を取得しています..."
            : `本日の分析可能回数：残り${remainingCount}回 / ${dailyLimit}回`}
        </div>
        <div>
          <label
            htmlFor="situation"
            className="mb-2 block font-semibold text-gray-800"
          >
            困った場面
          </label>

          <textarea
            id="situation"
            name="situation"
            rows={6}
            maxLength={500}
            value={situation}
            onChange={(event) => onSituationChange(event.target.value)}
            placeholder="例：上司から急な仕事を頼まれ、断りづらかった"
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-emerald-500"
          />

          <p className="mt-1 text-right text-sm text-gray-700">
            {situation.length} / 500
          </p>
        </div>

        <div>
          <label
            htmlFor="response"
            className="mb-2 block font-semibold text-gray-800"
          >
            そのとき取った対応
          </label>

          <textarea
            id="response"
            name="response"
            rows={6}
            maxLength={500}
            value={response}
            onChange={(event) => onResponseChange(event.target.value)}
            placeholder="例：断れず、そのまま仕事を引き受けた"
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-emerald-500"
          />

          <p className="mt-1 text-right text-sm text-gray-700">
            {response.length} / 500
          </p>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze || isLoading || remainingCount === null || remainingCount === 0}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isLoading ? "分析中..." : "分析する"}
        </button>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-700">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}