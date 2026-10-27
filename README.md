# アサーションCheck

AIを活用して、アサーティブ・コミュニケーションを練習するWebアプリケーションです。

ユーザーが日常生活や職場で困ったコミュニケーション場面と、その際に取った対応を入力すると、AIが対応の傾向を分析します。

分析結果をもとに、自分のコミュニケーションの特徴を振り返り、より適切な自己表現を身につけることを目的としています。

### アプリURL

https://assertion-check.com

> **開発状況**
>
> MVPの主要機能を実装し、AWS本番環境へのデプロイを完了しています。
>
> 現在はレビューを通じた改善および追加機能の検討を進めています。

---

## 1. アプリ概要

### 開発目的

アサーティブ・コミュニケーションとは、自分の意見や気持ちを大切にしながら、相手の立場や考え方も尊重するコミュニケーション方法です。

本アプリでは、AIを活用して自身のコミュニケーションを客観的に振り返り、アサーティブな対応を練習できる環境を提供します。

### 想定ユーザー

- 職場や日常生活でのコミュニケーションに悩んでいる方
- 自分の意見や気持ちを適切に伝える練習をしたい方
- アサーティブ・コミュニケーションを学びたい方
- 過去のコミュニケーションを振り返り、改善につなげたい方

### アプリの基本的な流れ

1. ユーザー登録・ログイン
2. 困ったコミュニケーション場面を入力
3. その際に取った対応を入力
4. AIがコミュニケーションの傾向を分析
5. 分析結果・フィードバック・改善例を表示
6. 分析履歴を保存し、後から振り返る

※ AI分析はユーザーごとに日本時間で1日10回まで利用できます。

---

## 2. 機能一覧

### MVP機能

| 機能 | 概要 | 実装状況 |
|---|---|---|
| ユーザー登録 | メールアドレス・ユーザー名を使用した新規登録 | ✅ |
| メール認証 | Cognitoによるメールアドレス確認 | ✅ |
| ログイン・ログアウト | Cognitoによるユーザー認証 | ✅ |
| アサーション分析 | 入力内容をAmazon Bedrockで分析 | ✅ |
| コミュニケーションタイプの数値化 | 3種類のコミュニケーション傾向を割合で表示 | ✅ |
| フィードバック | AIによる対応内容の評価 | ✅ |
| 改善例の提示 | よりアサーティブな対応例を提示 | ✅ |
| 分析回数制限 | ユーザーごとに日本時間で1日10回まで分析可能 | ✅ |
| 分析可能回数の表示 | 本日の残り分析可能回数を新規分析画面に表示 | ✅ |
| 分析結果の保存 | PostgreSQLへの分析内容・結果の保存 | ✅ |
| 分析履歴一覧 | 過去の分析履歴を一覧表示 | ✅ |
| 分析履歴詳細 | 保存済みの分析内容・結果を表示 | ✅ |
| ページネーション | 分析履歴を複数ページに分けて表示 | ✅ |
| マイページ | ユーザー情報の表示 | ✅ |
| アサーションの説明 | アサーションやコミュニケーションタイプを説明 | ✅ |
| レスポンシブ対応 | スマートフォンなどの画面サイズに応じたレイアウト調整 | ✅ |

### 3つのコミュニケーションタイプ

AIは、入力された対応を以下の3つの観点から分析します。

| タイプ | 説明 |
|---|---|
| アサーティブ | 自分と相手の両方を尊重する自己表現 |
| アグレッシブ | 自分の意見を優先し、相手への配慮が不足しやすい自己表現 |
| ノンアサーティブ | 相手を優先し、自分の意見や気持ちを抑えやすい自己表現 |

各タイプの割合を合計100%で表示します。

また、数値だけでなく、フィードバックと改善例を提示します。

### 追加機能（実装予定）

今後、利用状況やレビュー結果を踏まえて機能を追加する予定です。

候補として、以下を検討しています。

- 分析履歴の検索・絞り込み
- 分析履歴の編集・削除
- 分析結果の推移を可視化
- ユーザー情報の編集
- ゲストログイン
- UI・UXの改善

### 公開に向けた対応

- 利用規約の整備
- プライバシーポリシーの整備

※追加機能は現時点での検討案であり、実装内容は変更する可能性があります。

---

## 3. 技術スタック

### フロントエンド

| 技術 | 用途 |
|---|---|
| Next.js 16（App Router） | フロントエンドフレームワーク |
| React 19 | UI構築 |
| TypeScript | 型安全な開発 |
| Tailwind CSS 4 | スタイリング |
| AWS Amplify Auth | Cognitoとの認証連携 |

### バックエンド

| 技術 | 用途 |
|---|---|
| Hono 4 | API開発 |
| TypeScript | バックエンド開発 |
| Zod | リクエスト・レスポンスのバリデーション |
| Drizzle ORM | データベース操作 |
| Drizzle Kit | マイグレーション管理 |
| AWS SDK for JavaScript v3 | Amazon Bedrockとの連携 |
| aws-jwt-verify | ローカル環境でのCognito JWT検証 |

※本番環境では、API GatewayのJWTオーソライザーを使用して認証を行っています。

### データベース・開発環境

| 技術 | 用途 |
|---|---|
| PostgreSQL 17 | ユーザー情報・分析履歴の保存、分析利用回数の管理 |
| Docker | ローカルDB環境 |
| Node.js 24 | JavaScript実行環境 |
| npm | パッケージ管理 |
| Git / GitHub | ソースコード管理 |
| GitHub Actions | CI/CD（品質チェック・本番環境への自動デプロイ） |

### AWSサービス

| サービス | 用途 |
|---|---|
| AWS Amplify Hosting | Next.jsのホスティング |
| Amazon API Gateway | APIリクエスト受付・JWT認証 |
| AWS Lambda | Hono / TypeScriptの実行 |
| Amazon RDS for PostgreSQL | ユーザー情報・分析履歴の保存、分析利用回数の管理 |
| Amazon Cognito | ユーザー認証・JWTの発行 |
| Amazon Bedrock | Claude Haiku 4.5によるAI分析 |
| Amazon Route 53 | DNS・ドメイン管理 |
| Amazon VPC | AWSリソースのネットワーク管理 |
| VPC Endpoint | VPC内からBedrock・Secrets Managerへの接続 |
| AWS Secrets Manager | DB接続情報などの機密情報管理 |
| Amazon CloudWatch | ログ・監視 |
| AWS IAM | AWSサービスへのアクセス権限管理 |
| AWS Budgets | コスト管理・予算アラート |

---

## 4. システム構成

### ローカル開発環境

ローカル開発環境では、フロントエンドとバックエンドをローカルで起動しています。

データベースにはDocker上のPostgreSQLを使用し、認証と生成AIにはAWSのマネージドサービスを利用しています。

```text
                  ユーザー
                     |
                     v
             Next.js（ローカル）
                     |
                     v
               Hono API
                     |
          +----------+----------+
          |          |          |
          v          v          v
      Cognito     Bedrock   PostgreSQL
       (AWS)       (AWS)     (Docker)
```

※実際にはCognitoによる認証をフロントエンドから実行し、バックエンドではJWTを検証します。

### AWS本番環境

AWS東京リージョン（ap-northeast-1）に本番環境を構築しています。

主な構成は以下のとおりです。

| 役割 | AWSサービス |
|---|---|
| フロントエンド | AWS Amplify Hosting |
| API | Amazon API Gateway（HTTP API） |
| バックエンド | AWS Lambda |
| データベース | Amazon RDS for PostgreSQL |
| 生成AI | Amazon Bedrock |
| 認証 | Amazon Cognito |
| DNS・ドメイン管理 | Amazon Route 53 |
| ログ・監視 | Amazon CloudWatch |

### ネットワーク構成

東京リージョン（ap-northeast-1）にVPCを構築し、LambdaとRDSをプライベートサブネットに配置しています。

RDSにはSingle-AZ構成を採用しています。

DBサブネットグループには、AZ 1aとAZ 1cのDB用サブネットを登録しています。

AZ 1cのDB用サブネットはRDSの構成要件を満たすために用意したものであり、待機用RDSは配置していません。

また、LambdaからBedrockやSecrets Managerへのアクセスには、VPC Endpointを利用しています。

NAT Gatewayは設置せず、必要なAWSサービスへのプライベート接続を利用することで、コストを抑える構成としています。

### 認証方式

Amazon Cognitoを使用してユーザー認証を行っています。

JWTの検証方法は、ローカル環境と本番環境で異なります。

| 環境 | JWT検証方法 |
|---|---|
| ローカル | Honoのミドルウェア（aws-jwt-verify） |
| 本番 | API GatewayのJWTオーソライザー |

本番環境では、API GatewayがCognitoのJWTを検証します。

認証済みリクエストのみをLambdaに渡し、LambdaではAPI Gatewayから受け取ったユーザー識別子（`sub`）を使用して処理を行います。

### 監視・コスト管理

AWS本番環境では、CloudWatchによるログ・監視を設定しています。

主な監視項目は以下のとおりです。

| 項目 | 内容 |
|---|---|
| Lambda Errors | エラー発生の監視 |
| Lambda Duration | 実行時間の監視 |
| CloudWatch Logs | Lambdaのログ管理 |
| AWS Budgets | AWS利用料金の予算管理 |

LambdaのErrorsおよびDurationについてCloudWatchアラームを設定し、異常を検知できるようにしています。

また、AWS Budgetsを利用して、利用料金の増加を把握できるようにしています。

### AWSアーキテクチャ図

![AWSアーキテクチャ図](./docs/images/aws-architecture.svg)

---

## 5. データベース設計

データベースにはPostgreSQLを採用しています。

Drizzle ORMを使用してテーブル定義とデータベース操作を管理しています。

ローカル環境ではDocker上のPostgreSQLを使用し、本番環境ではAmazon RDS for PostgreSQLを利用しています。

### ER図

![ER図](./docs/images/er-diagram.png)

### テーブル一覧

| テーブル名 | 用途 |
|---|---|
| users | ユーザー情報の管理 |
| records | ユーザーが入力した分析内容の保存 |
| analysis_results | AIによる分析結果の保存 |
| analysis_usage | ユーザーごとのAI分析利用履歴の管理 |

### users

ユーザー情報を管理するテーブルです。

| カラム | 説明 |
|---|---|
| id | ユーザーID |
| cognito_sub | Cognitoのユーザー識別子 |
| username | ユーザー名 |
| created_at | 作成日時 |
| updated_at | 更新日時 |

Cognitoのユーザー識別子とDB上のユーザー情報を紐付けています。

### records

ユーザーが入力した分析内容を保存するテーブルです。

| カラム | 説明 |
|---|---|
| id | レコードID |
| user_id | ユーザーID |
| situation | 困った場面 |
| response | 取った対応 |
| created_at | 作成日時 |
| updated_at | 更新日時 |

### analysis_results

AIが生成した分析結果を保存するテーブルです。

| カラム | 説明 |
|---|---|
| id | 分析結果ID |
| record_id | 対応するレコードID |
| assertive_score | アサーティブ割合 |
| aggressive_score | アグレッシブ割合 |
| non_assertive_score | ノンアサーティブ割合 |
| feedback | AIによるフィードバック |
| improvement | 改善例 |
| created_at | 作成日時 |

### analysis_usage

ユーザーごとのAI分析利用履歴を管理するテーブルです。

AI分析のリクエストごとに1レコードを作成し、日本時間（JST）で当日のレコード数を集計することで、1日10回の利用制限を管理します。

| カラム | 説明 |
|---|---|
| id | 利用履歴ID |
| user_id | ユーザーID |
| created_at | AI分析の利用日時（TIMESTAMPTZ） |

`user_id`は`users`テーブルの外部キーです。

また、`user_id`と`created_at`に複合インデックスを設定し、ユーザーごとの日別利用履歴を効率的に取得できるようにしています。

### 利用回数の管理

AI分析のリクエスト時には、以下の処理を実行します。

1. 対象ユーザーのレコードを`SELECT ... FOR UPDATE`でロックする
2. JST基準で当日の利用履歴を取得し、レコード数を集計する
3. 利用回数が10回未満の場合、`analysis_usage`に1レコード追加する
4. 利用回数が10回に達している場合、HTTP 429を返す

`SELECT ... FOR UPDATE`による排他制御を行うことで、同一ユーザーから複数のリクエストが同時に送信された場合でも、利用回数の上限を超えないようにしています。

なお、利用履歴はAI分析の実行前に記録するため、Bedrockでエラーが発生した場合も利用回数としてカウントします。

### テーブル間の関連

```text
users
  |
  +----------------------+
  |                      |
  | 1対多                | 1対多
  v                      v
records              analysis_usage
  |
  | 1対1
  v
analysis_results
```

1人のユーザーが複数の分析履歴を持ち、1つの分析履歴に対して1つの分析結果が紐付きます。

また、1人のユーザーは複数のAI分析利用履歴を持ちます。

`analysis_usage`では、AI分析のリクエストごとにレコードを作成し、created_atをもとに日本時間（JST）で当日の利用回数を集計します。

---

## 6. ディレクトリ構成

フロントエンドとバックエンドを1つのリポジトリで管理するモノレポ構成を採用しています。

```text
Assertion_Check/
│
├── .github/
│   └── workflows/
│       ├── ci.yml             # CI
│       └── deploy.yml         # CD
│
├── frontend/                  # Next.js
│   └── src/
│       ├── app/               # 画面・ルーティング
│       ├── components/        # UIコンポーネント
│       ├── lib/               # 共通処理
│       └── types/             # 型定義
│
├── backend/                   # Hono
│   ├── drizzle/               # マイグレーションファイル
│   ├── drizzle.config.ts      # Drizzle Kitの設定
│   └── src/
│       ├── routes/            # APIルート
│       ├── services/          # ビジネスロジック
│       ├── middleware/        # 認証などの共通処理
│       ├── db/                # DB接続・スキーマ
│       └── schemas/           # バリデーション
│
├── docs/
│   └── images/                # AWS構成図・ER図
│
├── compose.yaml               # Docker Composeの設定
├── .nvmrc                     # Node.jsのバージョン
├── .gitignore
└── README.md
```

※ディレクトリ構成は主要なファイル・ディレクトリのみ記載しています。

---

## 7. ローカル環境構築

### 7-1. 前提条件

以下の環境が必要です。

| 項目 | 内容 |
|---|---|
| Node.js | 24.22.1（`.nvmrc` で指定） |
| npm | パッケージ管理 |
| Docker / Docker Compose | ローカルPostgreSQLの起動 |
| AWSアカウント | Cognito・Bedrockの利用 |
| Amazon Cognito | ユーザー認証の設定 |
| Amazon Bedrock | Claude Haiku 4.5の利用権限 |

※ CognitoとBedrockはAWS上のサービスを利用するため、ローカル環境でもAWS側の設定が必要です。

### 7-2. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd Assertion_Check
```

### 7-3. Node.jsのバージョン設定

本プロジェクトでは、Node.js 24.22.1を使用しています。

セキュリティ修正が適用されたNode.jsを使用するため、`.nvmrc`でバージョンを指定しています。

nvmを利用している場合、プロジェクトのルートディレクトリで以下を実行してください。

```bash
nvm install
nvm use
```

`.nvmrc`に記載されたNode.jsのバージョンが使用されます。

**バージョンの確認**

```bash
node -v
```

以下が表示されれば正常です。

```text
v24.22.1
```

### 7-4. パッケージのインストール

フロントエンドとバックエンドで、それぞれ依存パッケージをインストールします。

**フロントエンド**

```bash
cd frontend
npm ci
cd ..
```

**バックエンド**

```bash
cd backend
npm ci
cd ..
```

`npm ci` は、`package-lock.json` に基づいて依存パッケージをインストールするコマンドです。

### 7-5. 環境変数の設定

フロントエンドとバックエンドで、それぞれ環境変数を設定します。

| 設定ファイル | 用途 |
|---|---|
| `frontend/.env.local` | Cognitoの設定・API接続先など |
| `backend/.env` | DB接続情報・AWS関連の設定など |

#### データベース接続設定

バックエンドでは、`backend/.env` にPostgreSQLの接続情報を設定します。

```env
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@127.0.0.1:5432/<DB_NAME>
```

※ 上記はローカル開発用の設定例です。実際の設定値はDocker Composeの設定と一致させてください。

#### AWS関連の環境変数

本アプリでは、以下のAWSサービスを利用しています。

- Amazon Cognito：ユーザー認証
- Amazon Bedrock：AIによるアサーション分析

AWS環境は開発者が個別に管理しているため、認証情報や具体的な設定値は公開していません。

#### 注意事項

- `.env` および `.env.local` はGit管理対象外としています。
- AWSアクセスキーなどの認証情報はGitHubに公開していません。
- Cognito・Bedrockを利用するには、AWS側の設定と適切な権限が必要です。

### 7-6. PostgreSQLの起動

ローカル開発では、Docker Composeを使用してPostgreSQL 17を起動します。

プロジェクトのルートディレクトリで実行してください。

```bash
docker compose up -d
```

**起動状態の確認**

```bash
docker compose ps
```

**PostgreSQLへの接続**

```bash
docker compose exec postgres psql -U assertion_user -d assertion_check
```

**テーブル一覧の確認**

PostgreSQLに接続した状態で実行します。

```sql
\dt
```

**ユーザー情報の確認**

```sql
SELECT id, username, created_at
FROM users;
```

**PostgreSQLから切断**

```text
\q
```

**PostgreSQLの停止**

```bash
docker compose down
```

※ `docker compose down` では、通常、永続化されたDBデータは削除されません。

※ `docker compose down -v` はボリュームも削除するため、DBデータを消したくない場合は実行しないでください。

### 7-7. Drizzle ORMのマイグレーション

データベース操作にはDrizzle ORMを使用し、マイグレーションはDrizzle Kitで管理しています。

以下のコマンドは、`backend` ディレクトリで実行してください。

**マイグレーションファイルの生成**

`schema.ts` を変更した場合に実行します。

```bash
npx drizzle-kit generate
```

**マイグレーションの適用**

```bash
npx drizzle-kit migrate
```

**マイグレーションの確認**

```bash
npx drizzle-kit check
```

※ 初回セットアップでは、リポジトリに含まれるマイグレーションファイルを適用するため、基本的には `migrate` を実行します。

### 7-8. バックエンドの起動

`backend` ディレクトリで実行します。

```bash
cd backend
npm run dev
```

バックエンドは以下のURLで起動します。

```text
http://localhost:8787
```

**ヘルスチェック**

別のターミナルで以下を実行します。

```bash
curl http://localhost:8787/health
```

正常な場合：

```json
{
  "status": "ok"
}
```

### 7-9. フロントエンドの起動

別のターミナルを開き、`frontend` ディレクトリで実行します。

```bash
cd frontend
npm run dev
```

ブラウザで以下にアクセスしてください。

```text
http://localhost:3000
```

### 7-10. 開発用コマンド

#### フロントエンド

`frontend` ディレクトリで実行します。

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm run lint` | ESLintによるコードチェック |
| `npm run type-check` | TypeScriptの型チェック |
| `npm run build` | 本番ビルド |

#### バックエンド

`backend` ディレクトリで実行します。

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動（ホットリロード） |
| `npm run lint` | ESLintによるコードチェック |
| `npm run type-check` | TypeScriptの型チェック |
| `npm run build` | Lambda用にバンドル |

### 7-11. CI/CD（継続的インテグレーション・継続的デリバリー）

GitHub Actionsを使用して、コードの品質チェックと本番環境へのデプロイを自動化しています。

#### CI

`main` ブランチへのpushおよびPull Request時に、フロントエンド・バックエンドそれぞれで以下を実行します。

```text
npm ci
   ↓
lint
   ↓
type-check
   ↓
build
```

これにより、依存パッケージの不足・Lintエラー・型エラー・ビルドエラーなどを検出します。

※ CIではAWSサービスへの実接続を行わず、ビルドに必要な環境変数にはダミー値を使用しています。

#### CD

CIが成功した後、GitHub ActionsからAWS本番環境へのデプロイを実行します。

主な処理は以下のとおりです。

1. GitHub ActionsのCIが成功
2. GitHub Actions OIDCを使用してAWSのIAMロールを引き受ける
3. AWS Lambdaのコードを更新
4. AWS Amplify Hostingのデプロイジョブを開始

これにより、`main` ブランチへの変更を本番環境へ反映できるようにしています。

AWSへの認証にはOIDCを利用し、GitHub Actionsに長期有効なAWSアクセスキーを保存しない構成としています。

---

## 8. 開発状況・今後の予定

### 現在の開発状況

MVPの主要機能およびAWS本番環境の構築・デプロイを完了しています。

#### MVP機能

- [x] 開発環境の構築
- [x] Amazon Bedrockとの連携
- [x] アサーション分析API
- [x] 新規分析画面
- [x] 分析結果画面
- [x] Cognitoによるユーザー認証
- [x] PostgreSQLへのデータ保存
- [x] 分析履歴一覧・詳細
- [x] 分析履歴のページネーション
- [x] マイページ
- [x] アサーションの説明機能
- [x] 分析結果画面の統合
- [x] ユーザーごとの分析回数制限（1日10回）
- [x] 本日の残り分析可能回数の表示
- [x] レスポンシブ対応

#### AWS本番環境

- [x] AWS初期設定・コスト管理
- [x] VPC・ネットワーク構築
- [x] RDS PostgreSQL構築
- [x] Amazon Bedrock設定
- [x] Amazon Cognito本番環境構築
- [x] AWS Lambda・API Gateway構築
- [x] AWS Amplify Hosting構築
- [x] Amazon Route 53による独自ドメイン設定
- [x] Amazon CloudWatchによる監視設定
- [x] GitHub ActionsによるCI/CD構築
- [x] AWS本番環境へのデプロイ

### 今後の予定

- [ ] レビュー結果を踏まえた改善
- [ ] UI・UXの改善
- [ ] 分析結果の可視化
- [ ] 追加機能の検討・実装
- [ ] 利用規約・プライバシーポリシーの整備

---

## 9. 参考資料

- [画面遷移図](https://claude.ai/artifact/NjiBnrcPJJYuhn4GPnPXVw)
- [UI設計書](https://claude.ai/artifact/LZGCTSUBgKM8sQnBJmMtmu)
