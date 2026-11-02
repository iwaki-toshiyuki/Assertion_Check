import { Hono } from "hono";
import { findUserByCognitoSub } from "../db/users.js";
import { findRecordsByUserId, findRecordByIdAndUserId, countRecordsByUserId, deleteRecordByIdAndUserId} from "../db/records.js";
import type { AuthEnv } from "../middleware/auth.js";

const records = new Hono<AuthEnv>();

// 認証済みユーザーの分析履歴一覧をページ単位で取得する
records.get("/", async (c) => {
  try {
    // クエリパラメータからページ番号を取得する
    const pageParam = c.req.query("page");
    const page = pageParam === undefined ? 1 : Number(pageParam);

    // 1ページあたりの表示件数
    const limit = 10;

    // ページ番号が正の整数でない場合は400を返す
    if (!Number.isSafeInteger(page) || page <= 0) {
      return c.json(
        { error: "ページ番号が不正です" },
        400,
      );
    }

    // offsetが安全な整数の範囲に収まることを確認する
    const offset = (page - 1) * limit;

    if (!Number.isSafeInteger(offset)) {
      return c.json(
        { error: "ページ番号が不正です" },
        400,
      );
    }

    // JWT認証で取得したCognitoのユーザーIDを取得する
    const cognitoSub = c.get("cognitoSub");

    // CognitoのsubからDBユーザーを検索する
    const user = await findUserByCognitoSub(cognitoSub);

    // DBにユーザーが存在しない場合は空の履歴一覧を返す
    if (!user) {
      return c.json({
        records: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    // ログインユーザーの分析履歴の総件数を取得する
    const total = await countRecordsByUserId(user.id);

    // 指定されたページの分析履歴を取得する
    const history = await findRecordsByUserId(
      user.id,
      page,
      limit,
    );

    // 総ページ数を計算する
    const totalPages = Math.ceil(total / limit);

    return c.json({
      records: history,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("分析履歴の取得に失敗しました:", error);

    return c.json(
      {
        error: "分析履歴の取得中にエラーが発生しました",
      },
      500,
    );
  }
});

// 指定された分析履歴の詳細を取得する
records.get("/:id", async (c) => {
  try {
    // URLから履歴IDを取得する
    const recordId = Number(c.req.param("id"));

    // 履歴IDが正の整数でない場合は400を返す
    if (!Number.isSafeInteger(recordId) || recordId <= 0) {
      return c.json(
        { error: "履歴IDが不正です" },
        400,
      );
    }

    // JWT認証で取得したCognitoのユーザーIDを取得する
    const cognitoSub = c.get("cognitoSub");

    // CognitoのsubからDBユーザーを検索する
    const user = await findUserByCognitoSub(cognitoSub);

    // DBにユーザーが存在しない場合は404を返す
    if (!user) {
      return c.json(
        { error: "分析履歴が見つかりません" },
        404,
      );
    }

    // 履歴IDとログインユーザーIDの両方を条件に検索する
    const record = await findRecordByIdAndUserId(recordId, user.id);

    // 履歴が存在しない、または他ユーザーの履歴の場合は404を返す
    if (!record) {
      return c.json(
        { error: "分析履歴が見つかりません" },
        404,
      );
    }

    return c.json(record);
  } catch (error) {
    console.error("分析履歴の詳細取得に失敗しました:", error);

    return c.json(
      { error: "分析履歴の詳細取得中にエラーが発生しました" },
      500,
    );
  }
});

// ログインユーザー本人の分析履歴を削除する。
records.delete("/:id", async (c) => {
  try {
    const recordId = Number(c.req.param("id"));

    // 不正な履歴IDはDB処理へ渡さない。
    if (!Number.isSafeInteger(recordId) || recordId <= 0) {
      return c.json({ error: "履歴IDが不正です" }, 400);
    }

    // ユーザーIDはリクエスト本文ではなく、認証情報から取得する。
    const cognitoSub = c.get("cognitoSub");
    const user = await findUserByCognitoSub(cognitoSub);

    if (!user) {
      return c.json({ error: "分析履歴が見つかりません" }, 404);
    }

    const deleted = await deleteRecordByIdAndUserId(recordId, user.id);

    // 他人の履歴も、存在しない履歴と同じ扱いにする。
    if (!deleted) {
      return c.json({ error: "分析履歴が見つかりません" }, 404);
    }

    // 削除成功時は本文なしで返す。
    return c.body(null, 204);
  } catch (error) {
    console.error("分析履歴の削除に失敗しました:", error);

    return c.json(
      { error: "分析履歴の削除中にエラーが発生しました" },
      500,
    );
  }
});


export default records;

