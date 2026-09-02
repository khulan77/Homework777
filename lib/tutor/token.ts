import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { sessionSecret } from "@/lib/env";
import type { SessionState } from "./types";

/**
 * Session-ий төлөвийг гарын үсэгтэй, задалж болох token болгоно.
 *
 * Яагаад token, cookie биш:
 *  · Олон таб зэрэг ажиллана (нэг хүүхэд хоёр бодлого нээж болно).
 *  · Сервер нь төлөвгүй — Phase 4-т DB руу шилжихэд өөрчлөлт бага.
 *
 * Яагаад аюулгүй вэ: доторх өгөгдөлд ЗӨВ ХАРИУ БАЙХГҮЙ — зөвхөн байрлал
 * (аль алхам, хэдэн удаа буруудсан). Хүүхэд задалж уншсан ч хариу олдохгүй.
 * HMAC нь өөрчлөхөөс сэргийлнэ — жишээ нь `status: "solved"` гэж хуурч болохгүй.
 */
const cursorSchema = z.object({
  problemId: z.string().min(1).max(64),
  stepIndex: z.number().int().min(0).max(50),
  wrongCount: z.number().int().min(0).max(50),
  hintLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  unaidedSteps: z.number().int().min(0).max(50),
  totalSteps: z.number().int().min(0).max(50),
  status: z.enum(["active", "solved", "taughtOut", "abandoned"]),
  startedAt: z.number().int().positive(),
});

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function encodeSession(state: SessionState): string {
  const payload = b64url(JSON.stringify(state));
  return `${payload}.${sign(payload)}`;
}

/**
 * Token-ийг задалж, гарын үсгийг шалгана.
 * Хуурамч, гэмтсэн, эсвэл хэлбэр нь буруу бол `null` — дуудагч талд шинээр эхлүүлнэ.
 */
export function decodeSession(token: string): SessionState | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const given = token.slice(dot + 1);
  const expected = sign(payload);

  // Урт нь зөрвөл timingSafeEqual шидэх тул эхлээд шалгана.
  if (given.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(given), Buffer.from(expected))) return null;

  try {
    const raw: unknown = JSON.parse(Buffer.from(payload, "base64url").toString());
    const parsed = cursorSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
