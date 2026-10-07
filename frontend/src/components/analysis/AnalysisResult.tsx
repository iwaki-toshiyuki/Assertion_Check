// アサーション分析APIから返される分析結果の型
type AnalysisResultData = {
  assertive: number;
  aggressive: number;
  nonAssertive: number;
  feedback: string;
  suggestion: string;
};

type AnalysisResultProps = {
  result: AnalysisResultData;
};

// APIから取得したアサーション分析結果を表示する。
export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-800">分析結果</h2>

      <p>アサーティブ：{result.assertive}%</p>
      <p>アグレッシブ：{result.aggressive}%</p>
      <p>ノンアサーティブ：{result.nonAssertive}%</p>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-800">フィードバック</h3>
        <p className="mt-2 text-gray-600">{result.feedback}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-800">改善例</h3>
        <p className="mt-2 text-gray-600">{result.suggestion}</p>
      </div>
    </section>
  );
}