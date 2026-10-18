"use client";

import { useEffect, useState } from "react";
import { env } from "@/lib/env";
import { AnalysisForm } from "@/components/analysis/AnalysisForm";
import AssertionGuideLink from "@/components/assertion/AssertionGuideLink";
import { fetchAuthSession } from "aws-amplify/auth";
import type { AnalysisResponse } from "@/types/analysis";
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

  // 本日の残り分析可能回数を管理する
  // nullはAPIから取得する前の状態を表す
  const [remainingCount, setRemainingCount] = useState<number | null>(null);

  // 1日に分析できる最大回数
  const [dailyLimit, setDailyLimit] = useState(10);

  // 新規作成画面を開いた際に、本日の分析可能回数を取得する
  useEffect(() => {
    let isActive = true;

    const fetchAnalysisUsage = async () => {
      try {
        // Cognitoからアクセストークンを取得する
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();

        if (!accessToken) {
          throw new Error("認証情報を取得できませんでした");
        }

        // 本日の分析利用状況を取得する
        const apiResponse = await fetch(`${env.apiBaseUrl}/api/analysis/usage`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!apiResponse.ok) {
          throw new Error("分析利用状況の取得に失敗しました");
        }

        const usage: {
          dailyLimit: number;
          usedCount: number;
          remainingCount: number;
        } = await apiResponse.json();

        // 画面が表示されている場合のみStateを更新する
        if (isActive) {
          setDailyLimit(usage.dailyLimit);
          setRemainingCount(usage.remainingCount);
        }
      } catch (error) {
        console.error("分析利用状況の取得に失敗しました:", error);

        if (isActive) {
          setErrorMessage(
            "本日の分析可能回数を取得できませんでした。画面を再読み込みしてください。",
          );
        }
      }
    };

    void fetchAnalysisUsage();

    return () => {
      isActive = false;
    };
  }, []);

  // 両方の入力欄が空白以外で入力され、かつ本日の分析可能回数が残っている場合のみ分析を許可する。
  const canAnalyze =
  situation.trim().length > 0 &&
  response.trim().length > 0 &&
  remainingCount !== null &&
  remainingCount > 0;

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

      // 本日の分析回数の上限に達した場合は、専用メッセージを表示する
      if (apiResponse.status === 429) {
        setRemainingCount(0);

        setErrorMessage(
          "本日の分析回数の上限（10回）に達しました。明日以降に再度お試しください。",
        );

        return;
      }

      // その他のAPIエラーは従来どおり処理する
      if (!apiResponse.ok) {
        throw new Error("分析APIへのリクエストに失敗しました");
      }

      // 分析結果とDBに保存されたレコードIDを取得する。
      const result: AnalysisResponse = await apiResponse.json();

      // 保存されたレコードIDを使って、分析履歴詳細画面へ遷移する。
      router.push(`/analysis/${result.recordId}`);

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

          {/* 新規作成画面の見出し */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-emerald-800">
              アサーションCheck
            </h1>

            <p className="mt-3 text-gray-600">
              コミュニケーションで困った場面を振り返ってみましょう。
            </p>
          </header>

          {/* アサーションの説明画面への案内 */}
          <div className="mb-8">
            <AssertionGuideLink />
          </div>

          {/* 入力フォームに必要な状態とイベント処理を子コンポーネントへ渡す。 */}
          <AnalysisForm
            situation={situation}
            response={response}
            isLoading={isLoading}
            errorMessage={errorMessage}
            canAnalyze={canAnalyze}
            remainingCount={remainingCount}
            dailyLimit={dailyLimit}
            onSituationChange={setSituation}
            onResponseChange={setResponse}
            onAnalyze={handleAnalyze}
          />

        </div>
      </main>
  );
}