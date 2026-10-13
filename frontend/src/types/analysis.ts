// アサーション分析結果の共通型。
// 分析結果の表示コンポーネントなどで再利用する。
export type AnalysisResultData = {
  assertive: number;
  aggressive: number;
  nonAssertive: number;
  feedback: string;
  suggestion: string;
};

// 分析APIのレスポンス型。
// 分析結果に加えて、DBに保存したレコードIDを受け取る。
export type AnalysisResponse = AnalysisResultData & {
  recordId: number;
};