"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { AnalysisResult } from "@/components/analysis/AnalysisResult";
import type { AnalysisResultData } from "@/types/analysis";

// 分析結果画面。
// Step 7でDBを導入するまでは、sessionStorageから分析結果を取得する。
export default function AnalysisResultPage() {
    // 今回は同じ画面内での更新通知を必要としないため、購読処理は行わない。
    const subscribe = () => () => {};

    // ブラウザ側ではsessionStorageから分析結果を取得する。
    const getSnapshot = () => sessionStorage.getItem("analysisResult");

    // サーバー側ではsessionStorageを参照できないため、nullを返す。
    const getServerSnapshot = () => null;

    // ブラウザに一時保存された分析結果を取得する。
    const storedResult = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
    );

    // 保存データを分析結果の型に変換する。
    let analysisResult: AnalysisResultData | null = null;

    if (storedResult) {
    try {
        analysisResult = JSON.parse(storedResult) as AnalysisResultData;
    } catch (error) {
        console.error("分析結果の読み込みに失敗しました:", error);
    }
    }

  return (
      <main className="min-h-screen bg-emerald-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* 画面タイトル */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-emerald-800">
              分析結果
            </h1>

            <p className="mt-3 text-gray-600">
              あなたのコミュニケーションを振り返ってみましょう。
            </p>
          </header>

          {/* 分析結果の読み込み中 */}
          {analysisResult ? (
            <AnalysisResult result={analysisResult} />
            ) : (
                <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
                    <p className="text-gray-600">
                    表示できる分析結果がありません。
                    </p>

                    <Link
                    href="/analysis/new"
                    className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
                    >
                    新規作成へ戻る
                    </Link>
                </section>
            )}

          {/* ホーム画面へ戻るリンク */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="font-semibold text-emerald-700 hover:underline"
            >
              ホームへ戻る
            </Link>
          </div>
        </div>
      </main>
  );
}