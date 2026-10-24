import { eq } from "drizzle-orm";
import { getDb } from "./client.js";
import { users } from "./schema.js";

// Cognitoのsubを使用してDBユーザーを検索する
export async function findUserByCognitoSub(cognitoSub: string) {
  const db = await getDb();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.cognitoSub, cognitoSub))
    .limit(1);

  // 未登録の場合はundefinedを返す
  return user;
}

// Cognitoのユーザー情報をPostgreSQLに新規登録する
export async function createUser(
  cognitoSub: string,
  username: string,
) {
  const db = await getDb();

  const [user] = await db
    .insert(users)
    .values({
      cognitoSub,
      username,
    })
    .returning();

  return user;
}

// Cognitoのsubを使用してDBユーザーを取得・登録する
export async function findOrCreateUser(
  cognitoSub: string,
  username: string,
) {
  // 既存ユーザーが登録されているか確認する
  const existingUser = await findUserByCognitoSub(cognitoSub);

  if (existingUser) {
    return existingUser;
  }

  const db = await getDb();

  // Cognitoのsubが重複した場合は既存ユーザーを取得する
  const [user] = await db
    .insert(users)
    .values({
      cognitoSub,
      username,
    })
    .onConflictDoUpdate({
      target: users.cognitoSub,
      set: {
        cognitoSub,
      },
    })
    .returning();

  return user;
}