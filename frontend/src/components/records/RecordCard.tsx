import Link from "next/link";
import type { AnalysisRecord } from "@/types/records";

// 履歴カードに渡すデータの型
type RecordCardProps = {
  record: AnalysisRecord;
  page: number;
};

// 分析履歴1件分をカード形式で表示するコンポーネント
export function RecordCard({ record, page }: RecordCardProps) {
  // 保存日時を日本語形式で表示する
  const formattedDate = new Date(record.createdAt).toLocaleDateString(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  );

  return (
    <Link
      href={`/analysis/${record.id}?fromPage=${page}`}
      className="block rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <article>
        {/* 分析日時 */}
        <time
          dateTime={record.createdAt}
          className="text-sm text-gray-500"
        >
          {formattedDate}
        </time>

        {/* 困った場面 */}
        <p className="mt-3 line-clamp-2 break-words font-medium text-gray-800">
          {record.situation}
        </p>

        {/* アサーティブ度 */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-emerald-700">
            アサーティブ度 {record.assertiveScore}%
          </span>

          <span className="text-sm text-gray-500">
            詳細を見る →
          </span>
        </div>
      </article>
    </Link>
  );
}