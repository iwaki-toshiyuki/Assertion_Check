"use client";

import { useState } from "react";
import { env } from "@/lib/env";
import { AnalysisResult } from "@/components/analysis/AnalysisResult";
import { AnalysisForm } from "@/components/analysis/AnalysisForm";
import AuthStatus from "@/components/auth/AuthStatus";
import AuthGuard from "@/components/auth/AuthGuard";

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
    <AuthGuard>
      <main className="min-h-screen bg-emerald-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">

          {/* ログイン状態に応じてログインリンク・ログアウトボタンを表示する */}
          <div className="mb-6 flex justify-end">
            <AuthStatus />
          </div>

          {/* アプリ名・画面の説明 */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-emerald-800">
              アサーションCheck
            </h1>

            <p className="mt-3 text-gray-600">
              コミュニケーションで困った場面を振り返ってみましょう。
            </p>
          </header>

          {/* 入力フォームに必要な状態とイベント処理を子コンポーネントへ渡す。 */}
          <AnalysisForm
            situation={situation}
            response={response}
            isLoading={isLoading}
            errorMessage={errorMessage}
            canAnalyze={canAnalyze}
            onSituationChange={setSituation}
            onResponseChange={setResponse}
            onAnalyze={handleAnalyze}
          />

          {/* 分析結果が取得できた場合のみ、分析結果コンポーネントを表示する。 */}
          {analysisResult && (
            <AnalysisResult result={analysisResult} />
          )}

        </div>
      </main>
    </AuthGuard>
  );
}