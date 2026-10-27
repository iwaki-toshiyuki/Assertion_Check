"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams , useSearchParams } from "next/navigation";
import { fetchAuthSession } from "aws-amplify/auth";
import { env } from "@/lib/env";
import { AnalysisResult } from "@/components/analysis/AnalysisResult";
import AssertionGuideLink from "@/components/assertion/AssertionGuideLink";
import type { AnalysisRecordDetail } from "@/types/records";
import type { AnalysisResultData } from "@/types/analysis";

// 保存済みの分析履歴を表示する詳細画面。
export default function AnalysisHistoryDetailPage() {
  const params = useParams<{ id: string }>();
  const recordId = params.id;

  // 履歴一覧で表示していたページ番号を取得する
const searchParams = useSearchParams();
const fromPageParam = searchParams.get("fromPage");

// 不正なページ番号の場合は1ページ目に戻す
const parsedPage = Number(fromPageParam);

const fromPage =
  fromPageParam !== null &&
  Number.isSafeInteger(parsedPage) &&
  parsedPage > 0
    ? parsedPage
    : 1;

  // APIから取得した分析履歴の詳細情報を管理する。
  const [record, setRecord] = useState<AnalysisRecordDetail | null>(null);

  // データ取得中の状態を管理する。
  const [isLoading, setIsLoading] = useState(true);

  // データ取得時のエラーメッセージを管理する。
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 指定された履歴IDの詳細情報を取得する。
    const fetchRecord = async () => {
      try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();

        if (!accessToken) {
          throw new Error("認証情報を取得できませんでした");
        }

        // JWTを付与して履歴詳細APIを呼び出す。
        const response = await fetch(
          `${env.apiBaseUrl}/api/records/${recordId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          },
        );

        if (response.status === 404) {
          setErrorMessage("指定された分析履歴が見つかりません。");
          return;
        }

        if (!response.ok) {
          throw new Error("分析履歴の詳細取得に失敗しました");
        }

        const data: AnalysisRecordDetail = await response.json();

        setRecord(data);
      } catch (error) {
        console.error("分析履歴の詳細取得に失敗しました:", error);

        setErrorMessage(
          "分析履歴を取得できませんでした。時間をおいて再度お試しください。",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRecord();
  }, [recordId]);

  // 履歴詳細APIのデータを既存コンポーネント用の形式に変換する。
  const analysisResult: AnalysisResultData | null = record
    ? {
        assertive: record.assertiveScore,
        aggressive: record.aggressiveScore,
        nonAssertive: record.nonAssertiveScore,
        feedback: record.feedback,
        suggestion: record.improvement,
      }
    : null;

  return (
    <main className="min-h-full bg-emerald-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* 画面タイトル */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-800 sm:text-3xl">
            分析履歴の詳細
          </h1>

          <p className="mt-3 text-gray-600">
            過去のコミュニケーションを振り返りましょう。
          </p>
        </header>

        {/* アサーションの説明画面への案内（取得中・エラー時も表示する） */}
        <div className="mb-8">
          <AssertionGuideLink />
        </div>

        {isLoading ? (
          <p className="rounded-2xl bg-white p-5 text-center sm:p-8 text-gray-600">
            分析履歴を読み込んでいます...
          </p>
        ) : errorMessage ? (
          <p
            role="alert"
            className="rounded-2xl bg-white p-5 text-center sm:p-8 text-red-600"
          >
            {errorMessage}
          </p>
        ) : record && analysisResult ? (
          <>
            {/* 保存済みの入力内容 */}
            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                分析内容
              </h2>

              <h3 className="font-semibold text-gray-800">
                困った場面
              </h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-gray-600">
                {record.situation}
              </p>

              <h3 className="mt-6 font-semibold text-gray-800">
                取った対応
              </h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-gray-600">
                {record.response}
              </p>
            </section>

            {/* 既存の分析結果コンポーネントを再利用する */}
            <AnalysisResult result={analysisResult} />
          </>
        ) : (
          <p className="rounded-2xl bg-white p-5 text-center sm:p-8 text-gray-600">
            表示できる分析履歴がありません。
          </p>
        )}

        {/* 履歴一覧へ戻るリンク */}
        <div className="mt-8 text-center">
          <Link
            href={`/?page=${fromPage}`}
            className="font-semibold text-emerald-700 hover:underline"
          >
            履歴一覧に戻る
          </Link>
        </div>
      </div>
    </main>
  );
}