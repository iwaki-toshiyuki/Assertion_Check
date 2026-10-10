"use client";

import { useState } from "react";
import { env } from "@/lib/env";
import { AnalysisForm } from "@/components/analysis/AnalysisForm";
import AuthStatus from "@/components/auth/AuthStatus";
import AuthGuard from "@/components/auth/AuthGuard";
import { fetchAuthSession } from "aws-amplify/auth";
import type { AnalysisResultData } from "@/types/analysis";
import { useRouter } from "next/navigation";


export default function NewAnalysisPage() {
   // 分析完了後に結果画面へ遷移するために利用する。
  const router = useRouter();

   // 入力内容を画面上で管理し、文字数表示や後続のAPI送信に利用する。
  const [situation, setSituation] = useState("");
  const [response, setResponse] = useState("");

  // APIへの分析リクエスト中かどうかを管理する。
  const [isLoading, setIsLoading] = useState(false);

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
      // Cognitoからアクセストークンを取得する
      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken?.toString();

      // アクセストークンが取得できない場合はエラーにする
      if (!accessToken) {
        throw new Error("認証情報を取得できませんでした。再度ログインしてください。");
      }

      const apiResponse = await fetch(`${env.apiBaseUrl}/api/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          situation,
          response,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error("分析APIへのリクエストに失敗しました");
      }

      const result: AnalysisResultData = await apiResponse.json();

      // 分析結果を次の画面へ引き継ぐため、一時的にsessionStorageへ保存する。
      sessionStorage.setItem("analysisResult", JSON.stringify(result));

      // 分析結果画面へ移動する。
      router.push("/analysis/result");

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

          {/* 新規作成画面の見出し */}
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

        </div>
      </main>
    </AuthGuard>
  );
}