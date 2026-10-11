# アサーションCheck

AIを用いてアサーティブ・コミュニケーションを練習するWebアプリです。

## リポジトリ構成

```
.
├── frontend/   # Next.js (App Router / TypeScript / Tailwind CSS)
├── backend/    # Hono (TypeScript / AWS Lambda 対応)
└── .github/    # GitHub Actions (CI)
```

## 前提

- Node.js 24（`.nvmrc` で指定。nvm の場合はルートで `nvm use`）

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
| `npm run type-check` | TypeScript 型チェック |
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
| `npm run type-check` | TypeScript 型チェック |
| `npm run build` | Lambda用にバンドル（`dist/lambda.mjs`、ハンドラー名 `handler`） |

## データベース（PostgreSQL）

ローカル開発では、Docker Composeを使用してPostgreSQL 17を起動する。

ORMにはDrizzle ORMを使用し、マイグレーションはDrizzle Kitで管理する。

### PostgreSQLの起動

プロジェクトのルートディレクトリで実行する。

```bash
docker compose up -d
```

### PostgreSQLの状態確認

```bash
docker compose ps
```

### PostgreSQLへの接続

```bash
docker compose exec postgres psql -U assertion_user -d assertion_check
```

### テーブル一覧の確認

PostgreSQLに接続した状態で実行する。

```sql
\dt
```

### ユーザー情報の確認

```sql
SELECT id, username, created_at
FROM users;
```

### PostgreSQLから切断

```text
\q
```

### PostgreSQLの停止

```bash
docker compose down
```

※ `docker compose down`では、通常、永続化されたDBデータは削除されない。

※ `docker compose down -v`はボリュームも削除するため、DBデータを消したくない場合は実行しない。

---

### Drizzle ORMのマイグレーション

以下は`backend`ディレクトリで実行する。

#### マイグレーションファイルの生成

`schema.ts`を変更した場合に実行する。

```bash
npx drizzle-kit generate
```

#### マイグレーションの適用

```bash
npx drizzle-kit migrate
```

#### マイグレーションの確認

```bash
npx drizzle-kit check
```

### 環境変数

バックエンドのローカル開発では、`backend/.env`にDB接続情報を設定する。

```env
DATABASE_URL=postgresql://assertion_user:assertion_password@127.0.0.1:5432/assertion_check
```

※ `.env`はGit管理対象に含めない。

## CI

GitHub Actions（`.github/workflows/ci.yml`）で、`main` への push と Pull Request 時に
frontend / backend それぞれ `lint` → `type-check` → `build` を実行します。
