"use client";

import { useEffect, useRef } from "react";

type DeleteRecordDialogProps = {
  isDeleting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

// 分析履歴を削除する前に、取り消せない操作であることを確認する。
export default function DeleteRecordDialog({
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteRecordDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    // モーダルとして開き、最初はキャンセルにフォーカスする。
    if (!dialog.open) {
      dialog.showModal();
      cancelButtonRef.current?.focus();
    }

    return () => {
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-record-title"
      aria-describedby="delete-record-description"
      aria-busy={isDeleting}
      onCancel={(event) => {
        // Escキーで閉じる操作も、削除中は受け付けない。
        event.preventDefault();

        if (!isDeleting) {
          onClose();
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/40"
    >
      <h2 id="delete-record-title" className="text-lg font-bold">
        分析履歴を削除しますか？
      </h2>

      <p
        id="delete-record-description"
        className="mt-3 text-sm leading-6 text-gray-700"
      >
        この履歴と分析結果は完全に削除されます。
        削除後は元に戻せません。
      </p>

      {/* 失敗時はモーダルを残し、再試行できるようにする。 */}
      {errorMessage && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          ref={cancelButtonRef}
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          キャンセル
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "削除中…" : "削除する"}
        </button>
      </div>
    </dialog>
  );
}