"use client";

import { useState } from "react";
import { env } from "@/lib/env";

// アサーション分析APIから返される分析結果の型
type AnalysisResult = {
  assertive: number;
  aggressive: number;
  nonAssertive: number;
  feedback: string;
  suggestion: string;
};


export default function Home() {
   // 入力内容を画面上で管理し、文字数表示や後続のAPI送信に利用する。
  const [situation, setSituation] = useState("");
  const [response, setResponse] = useState("");

  // APIへの分析リクエスト中かどうかを管理する。
  const [isLoading, setIsLoading] = useState(false);

  // APIから取得した分析結果を画面表示に利用するため保持する。
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  // 分析処理で発生したエラーメッセージを画面表示するために保持する。
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 空白のみの入力も未入力として扱い、両方入力された場合のみ分析可能にする。
  const canAnalyze =
    situation.trim().length > 0 && response.trim().length > 0;

  // 分析ボタン押下時の処理。
  // 入力内容を分析APIへ送信し、アサーション分析を実行する。
  const handleAnalyze = async () => {
    if (!canAnalyze) {
      return;
    }

  // 新しい分析を開始する際に、前回のエラーをリセットする。
  setErrorMessage(null);

  // 分析開始時にローディング状態へ切り替える。
  setIsLoading(true);


    try {
      const apiResponse = await fetch(`${env.apiBaseUrl}/api/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          situation,
          response,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error("分析APIへのリクエストに失敗しました");
      }

      const result: AnalysisResult = await apiResponse.json();

      // APIから返された分析結果をstateに保存する。
      setAnalysisResult(result);
    } catch (error) {
      console.error("分析処理に失敗しました:", error);

      // 内部エラーの詳細は表示せず、ユーザー向けのメッセージを設定する。
      setErrorMessage(
        "分析中にエラーが発生しました。時間をおいてもう一度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <main className="min-h-screen bg-emerald-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* アプリ名・画面の説明 */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-800">
            アサーションCheck
          </h1>

          <p className="mt-3 text-gray-600">
            コミュニケーションで困った場面を振り返ってみましょう。
          </p>
        </header>

        {/* アサーション分析の入力フォーム */}
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
                onChange={(event) => setSituation(event.target.value)}
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
                onChange={(event) => setResponse(event.target.value)}
                placeholder="例：断れず、そのまま仕事を引き受けた"
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:border-emerald-500"
              />

              <p className="mt-1 text-right text-sm text-gray-500">
                {response.length} / 500
              </p>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
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
        {analysisResult && (
          <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              分析結果
            </h2>

            <p>アサーティブ：{analysisResult.assertive}%</p>
            <p>アグレッシブ：{analysisResult.aggressive}%</p>
            <p>ノンアサーティブ：{analysisResult.nonAssertive}%</p>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800">フィードバック</h3>
              <p className="mt-2 text-gray-600">
                {analysisResult.feedback}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800">改善例</h3>
              <p className="mt-2 text-gray-600">
                {analysisResult.suggestion}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}