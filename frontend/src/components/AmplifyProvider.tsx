"use client";

import { useState, type ReactNode } from "react";
import { configureAmplify } from "@/lib/amplify";

// AmplifyProviderが受け取るPropsの型定義
type AmplifyProviderProps = {
  children: ReactNode;
};

export default function AmplifyProvider({
  children,
}: AmplifyProviderProps) {
  // 認証機能を利用する前に、クライアント側でAmplifyを初期化する
  useState(() => {
    configureAmplify();
  });

  return <>{children}</>;
}