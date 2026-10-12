"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAuthSession } from "aws-amplify/auth";
import { env } from "@/lib/env";
import { RecordCard } from "@/components/records/RecordCard";
import type { AnalysisRecord } from "@/types/records";

// ホーム画面。ログインユーザーの分析履歴を一覧表示する。
export default function Home() {
  // APIから取得した分析履歴を管理する。
  const [records, setRecords] = useState<AnalysisRecord[]>([]);

  // データ取得中の状態を管理する。
  const [isLoading, setIsLoading] = useState(true);

  // データ取得時のエラーメッセージを管理する。
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // ホーム画面表示時に分析履歴を取得する。
    const fetchRecords = async () => {
      try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();

        if (!accessToken) {
          throw new Error("認証情報を取得できませんでした");
        }

        // JWTを付与してログインユーザーの分析履歴を取得する。
        const response = await fetch(`${env.apiBaseUrl}/api/records`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("分析履歴の取得に失敗しました");
        }

        const data: AnalysisRecord[] = await response.json();

        setRecords(data);
      } catch (error) {
        console.error("分析履歴の取得に失敗しました:", error);

        setErrorMessage(
          "分析履歴を取得できませんでした。時間をおいて再度お試しください。",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRecords();
  }, []);

  return (
    <main className="min-h-full bg-emerald-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* 画面タイトル */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-800">
            アサーションCheck
          </h1>

          <p className="mt-3 text-gray-600">
            これまでの分析結果を振り返りましょう。
          </p>
        </header>

        {/* 新規作成画面へのリンク */}
        <div className="mb-8">
          <Link
            href="/analysis/new"
            className="block rounded-lg bg-emerald-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
          >
            新規作成
          </Link>
        </div>

        {/* 分析履歴一覧 */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            分析履歴
          </h2>

          {isLoading ? (
            // データ取得中
            <p className="rounded-xl bg-white p-6 text-center text-gray-600">
              分析履歴を読み込んでいます...
            </p>
          ) : errorMessage ? (
            // データ取得失敗
            <p
              role="alert"
              className="rounded-xl bg-white p-6 text-center text-red-600"
            >
              {errorMessage}
            </p>
          ) : records.length === 0 ? (
            // 分析履歴が存在しない場合
            <p className="rounded-xl bg-white p-6 text-center text-gray-600">
              分析履歴はまだありません。
            </p>
          ) : (
            // 取得した分析履歴をカード形式で表示する。
            <div className="space-y-4">
              {records.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}