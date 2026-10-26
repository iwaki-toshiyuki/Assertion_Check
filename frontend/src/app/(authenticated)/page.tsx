"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAuthSession } from "aws-amplify/auth";
import { env } from "@/lib/env";
import { RecordCard } from "@/components/records/RecordCard";
import AssertionGuideLink from "@/components/assertion/AssertionGuideLink";
import type {
  AnalysisRecord,
  Pagination,
  PaginatedRecordsResponse,
} from "@/types/records";

// ホーム画面。ログインユーザーの分析履歴を一覧表示する。
export default function Home() {
  // APIから取得した分析履歴を管理する。
  const [records, setRecords] = useState<AnalysisRecord[]>([]);

  // データ取得中の状態を管理する。
  const [isLoading, setIsLoading] = useState(true);

  // データ取得時のエラーメッセージを管理する。
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 現在のページ番号
  const [page, setPage] = useState(1);

  // APIから取得したページネーション情報
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // URLからページ番号を取得できたかどうか
  const [isPageReady, setIsPageReady] = useState(false);

  // URLのクエリパラメータからページ番号を取得する
  useEffect(() => {
    const syncPageFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get("page");

      const parsedPage = Number(pageParam);

      const initialPage =
        pageParam !== null &&
        Number.isSafeInteger(parsedPage) &&
        parsedPage > 0
          ? parsedPage
          : 1;

      setPage(initialPage);
      setIsPageReady(true);
    };

    syncPageFromUrl();

    // ブラウザの戻る・進む操作にも対応する
    window.addEventListener("popstate", syncPageFromUrl);

    return () => {
      window.removeEventListener("popstate", syncPageFromUrl);
    };
  }, []);

  // ページ番号が確定したら分析履歴を取得する
  useEffect(() => {
    // URLのページ番号を取得するまではAPIを呼び出さない
    if (!isPageReady) {
      return;
    }

    // ページ切り替え時に古いリクエスト結果が反映されないようにする
    let isActive = true;

    const fetchRecords = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();

        if (!accessToken) {
          throw new Error("認証情報を取得できませんでした");
        }

        // 現在のページ番号を指定して履歴を取得する
        const response = await fetch(
          `${env.apiBaseUrl}/api/records?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("分析履歴の取得に失敗しました");
        }

        const data: PaginatedRecordsResponse = await response.json();

        if (!isActive) {
          return;
        }

        setRecords(data.records);
        setPagination(data.pagination);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("分析履歴の取得に失敗しました:", error);

        setErrorMessage(
          "分析履歴を取得できませんでした。時間をおいて再度お試しください。",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchRecords();

    return () => {
      isActive = false;
    };
  }, [page, isPageReady]);

  // ページ切り替え時にURLも更新する
  const changePage = (newPage: number) => {
    if (
      newPage < 1 ||
      (pagination && newPage > pagination.totalPages)
    ) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("page", String(newPage));

    window.history.pushState(null, "", url);
    setPage(newPage);
  };

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

        {/* アサーションの説明画面への案内 */}
        <div className="mb-8">
          <AssertionGuideLink />
        </div>

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
            <div>
              {/* 分析履歴一覧 */}
              <div className="space-y-4">
                {records.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    page={page}
                  />
                ))}
              </div>

              {/* ページネーション */}
              {pagination && pagination.totalPages > 1 && (
                <nav
                  aria-label="分析履歴のページ切り替え"
                  className="mt-8 flex items-center justify-center gap-4"
                >
                  <button
                    type="button"
                    onClick={() => changePage(page - 1)}
                    disabled={page <= 1 || isLoading}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    前へ
                  </button>

                  <span className="text-sm text-gray-700">
                    {pagination.page} / {pagination.totalPages} ページ
                  </span>

                  <button
                    type="button"
                    onClick={() => changePage(page + 1)}
                    disabled={
                      page >= pagination.totalPages || isLoading
                    }
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    次へ
                  </button>
                </nav>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}