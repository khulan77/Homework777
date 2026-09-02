import { defineConfig } from "drizzle-kit";

/**
 * `db:generate` нь зөвхөн schema-г уншина — DATABASE_URL шаардахгүй.
 * `db:migrate` болон `db:studio` нь бодит холболт шаардана.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/placeholder",
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
});
