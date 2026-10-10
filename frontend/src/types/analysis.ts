// アサーション分析APIから返される分析結果の共通型。
// 分析入力画面・分析結果画面・表示コンポーネントで再利用する。
export type AnalysisResultData = {
  assertive: number;
  aggressive: number;
  nonAssertive: number;
  feedback: string;
  suggestion: string;
};