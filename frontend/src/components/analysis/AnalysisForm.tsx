// 分析フォームの表示・操作に必要な値とイベント処理を親コンポーネントから受け取る。
type AnalysisFormProps = {
  situation: string;
  response: string;
  isLoading: boolean;
  errorMessage: string | null;
  canAnalyze: boolean;
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
  onSituationChange,
  onResponseChange,
  onAnalyze,
}: AnalysisFormProps) {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="space-y-6">
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
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-emerald-500"
          />

          <p className="mt-1 text-right text-sm text-gray-500">
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
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-emerald-500"
          />

          <p className="mt-1 text-right text-sm text-gray-500">
            {response.length} / 500
          </p>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze || isLoading}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isLoading ? "分析中..." : "分析する"}
        </button>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}