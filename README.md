# アサーションCheck

AIを用いてアサーティブ・コミュニケーションを練習するWebアプリです。

## リポジトリ構成

```
.
├── frontend/   # Next.js (App Router / TypeScript / Tailwind CSS)
├── backend/    # Hono（構築予定）
└── .github/    # GitHub Actions（構築予定）
```

## フロントエンド

```bash
cd frontend
npm install
cp .env.example .env.local   # 環境変数を設定
npm run dev                  # http://localhost:3000
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript 型チェック |
| `npm run build` | 本番ビルド |
