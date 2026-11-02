"use client";

import { useState } from "react";

// ログイン・新規登録で共通利用するパスワード入力欄の設定。
type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "new-password" | "current-password";
  minLength?: number;
  error?: string;
  hint?: string;
};

// パスワード入力と、目のアイコンによる表示・非表示の切り替えを担当する。
export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
  minLength,
  error,
  hint,
}: PasswordInputProps) {
  // 入力欄ごとに表示状態を管理する。初期状態は非表示。
  const [isVisible, setIsVisible] = useState(false);

  // 補足説明やエラーを入力欄に関連付け、読み上げにも対応する。
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <div className="relative">
        {/* 表示状態に応じて、パスワードの伏せ字と通常表示を切り替える。 */}
        <input
          id={id}
          name={id}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-lg border bg-white py-2.5 pl-3 pr-12 text-gray-900 outline-none transition focus:ring-2 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-100"
          }`}
        />

        {/* フォームを送信せず、表示状態だけを切り替えるボタン。 */}
        <button
          type="button"
          onClick={() => setIsVisible((previous) => !previous)}
          aria-label={`${label}を${isVisible ? "隠す" : "表示する"}`}
          aria-controls={id}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-gray-700 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          {/* 目のアイコンを描画し、表示中は斜線を付ける。 */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {isVisible && <path d="m3 3 18 18" />}
          </svg>
        </button>
      </div>

      {/* 入力条件などの補足説明を表示する。 */}
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-gray-700">
          {hint}
        </p>
      )}

      {/* エラーがある場合は、入力欄の下に表示する。 */}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}