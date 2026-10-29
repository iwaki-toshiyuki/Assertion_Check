import type { AnalysisResultData } from "@/types/analysis";

type AnalysisResultProps = {
  result: AnalysisResultData;
};

// APIから取得したアサーション分析結果を表示する。
export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <h2 className="mb-4 text-xl font-bold text-gray-800">分析結果</h2>

      <p className="text-gray-900">アサーティブ：{result.assertive}%</p>
      <p className="text-gray-900">アグレッシブ：{result.aggressive}%</p>
      <p className="text-gray-900">ノンアサーティブ：{result.nonAssertive}%</p>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-800">フィードバック</h3>
        <p className="mt-2 break-words text-gray-800">{result.feedback}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-800">改善例</h3>
        <p className="mt-2 break-words text-gray-800">{result.suggestion}</p>
      </div>
    </section>
  );
}