# アサーションCheck

AIを用いてアサーティブ・コミュニケーションを練習するWebアプリです。

## リポジトリ構成

```
.
├── frontend/   # Next.js (App Router / TypeScript / Tailwind CSS)
├── backend/    # Hono (TypeScript / AWS Lambda 対応)
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

## バックエンド

```bash
cd backend
npm install
cp .env.example .env   # 環境変数を設定
npm run dev            # http://localhost:8787
curl http://localhost:8787/health   # => {"status":"ok"}
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動（ホットリロード） |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript 型チェック |
| `npm run build` | Lambda用にバンドル（`dist/lambda.mjs`、ハンドラー名 `handler`） |
