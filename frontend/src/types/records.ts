// 分析履歴一覧APIから取得するデータの型
export type AnalysisRecord = {
  id: number;
  situation: string;
  response: string;
  createdAt: string;
  assertiveScore: number;
  aggressiveScore: number;
  nonAssertiveScore: number;
};

// 分析履歴詳細APIから取得するデータの型
export type AnalysisRecordDetail = AnalysisRecord & {
  feedback: string;
  improvement: string;
};