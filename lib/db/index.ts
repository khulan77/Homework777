import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { requireDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

/**
 * Өгөгдлийн сангийн холболт.
 *
 * Залхуу (lazy): эхний дуудлага хүртэл холбогдохгүй. Ингэснээр DATABASE_URL
 * тохируулаагүй байхад ч бусад хуудас ажиллана — хөгжүүлэлтийг зогсоохгүй.
 *
 * Dev-д hot reload бүрт шинэ холболтын сан үүсгэхээс сэргийлж globalThis-д хадгална.
 */
type Db = ReturnType<typeof create>;

function create() {
  const client = postgres(requireDatabaseUrl(), {
    // Supabase-ийн pooler-тэй ажиллахад prepared statement унтраана.
    prepare: false,
    max: 10,
  });
  return drizzle(client, { schema, casing: "snake_case" });
}

const globalForDb = globalThis as unknown as { __manuuDb?: Db };

let cached: Db | undefined = globalForDb.__manuuDb;

export function db(): Db {
  if (!cached) {
    cached = create();
    if (process.env.NODE_ENV !== "production") globalForDb.__manuuDb = cached;
  }
  return cached;
}

export * as schema from "./schema";
