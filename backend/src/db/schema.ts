import {
  pgTable,
  bigserial,
  bigint,
  varchar,
  timestamp,
  integer,
  text,
} from 'drizzle-orm/pg-core';

// アプリ内のユーザー情報を管理するテーブル
// 認証情報（メールアドレス・パスワード）はCognito側で管理する
export const users = pgTable('users', {
  // アプリ内で使用するユーザーID
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  // Cognitoのユーザーを一意に識別するID
  cognitoSub: varchar('cognito_sub', { length: 255 })
    .notNull()
    .unique(),

  // アプリ上で表示するユーザー名
  username: varchar('username', { length: 20 }).notNull(),

  // 作成日時
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),

  // 更新日時（Drizzle ORM経由の更新時に自動更新）
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ユーザーが入力したコミュニケーションの記録を管理するテーブル
export const records = pgTable('records', {
  // 記録を一意に識別するID
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  // 記録を作成したユーザーのID（users.idを参照）
  userId: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),

  // コミュニケーションで困った場面（最大500文字）
  situation: varchar('situation', { length: 500 }).notNull(),

  // 困った場面に対して実際に取った対応（最大500文字）
  response: varchar('response', { length: 500 }).notNull(),

  // 作成日時
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),

  // 更新日時（Drizzle ORM経由の更新時に自動更新）
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// AIによるコミュニケーション分析結果を管理するテーブル
export const analysisResults = pgTable('analysis_results', {
  // 分析結果を一意に識別するID
  id: bigserial('id', { mode: 'number' }).primaryKey(),

  // 分析対象の記録ID（records.idを参照）
  // unique制約により、1つの記録に対して分析結果は1件のみ
  recordId: bigint('record_id', { mode: 'number' })
    .notNull()
    .unique()
    .references(() => records.id),

  // アサーティブ度（割合）
  assertiveScore: integer('assertive_score').notNull(),

  // アグレッシブ度（割合）
  aggressiveScore: integer('aggressive_score').notNull(),

  // ノンアサーティブ度（割合）
  nonAssertiveScore: integer('non_assertive_score').notNull(),

  // AIが生成したフィードバック
  feedback: text('feedback').notNull(),

  // よりアサーティブな対応を取るための改善案
  improvement: text('improvement').notNull(),

  // AI分析結果の作成日時
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
});