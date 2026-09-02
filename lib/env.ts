import "server-only";
import { z } from "zod";

/**
 * Орчны хувьсагчийн цорын ганц хаалга.
 *
 * Next.js-ийн зөвлөмж: `process.env`-д ЗӨВХӨН энэ файл ханддаг байх. Ингэснээр
 * нууц түлхүүр санамсаргүйгээр клиент рүү гоожих зам хаагдана.
 *
 * Фазаар нэмэгддэг: Phase 0–1-д DB хэрэггүй тул DB-ийн хувьсагчид optional.
 * Тэдгээрийг ашиглах үед `requireDatabaseUrl()` дуудна — тэр үед л унана.
 * Ингэснээр "DATABASE_URL байхгүй" гэж хөгжүүлэлтийн эхний өдөр унахгүй.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  /** Session-ий cookie-г гарын үсэг зурахад. Phase 1-д хэрэгтэй. */
  SESSION_SECRET: z.string().min(32).optional(),

  /* ── Phase 2-оос эхлэн ── */
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),

  /* ── Дараагийн эргэлтэд ── */
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  CHIMEGE_API_KEY: z.string().min(1).optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Boot дээр унана — production-д тал дутуу тохиргоотой ажиллахаас сэргийлнэ.
  const issues = parsed.error.issues
    .map((i) => `  · ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Орчны хувьсагч буруу байна:\n${issues}`);
}

export const env = parsed.data;

/**
 * Хөгжүүлэлтийн үед SESSION_SECRET заавал биш — тогтмол dev түлхүүр ашиглана.
 * Production-д байхгүй бол унана.
 */
export function sessionSecret(): string {
  if (env.SESSION_SECRET) return env.SESSION_SECRET;
  if (env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET production-д заавал шаардлагатай.");
  }
  return "dev-only-insecure-secret-do-not-use-in-production!!";
}

export function requireDatabaseUrl(): string {
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL тохируулаагүй байна. .env.local файлыг .env.example-ээс хуулна уу.",
    );
  }
  return env.DATABASE_URL;
}
