"use server";

import { z } from "zod";
import { getProblem } from "@/lib/content/problems";
import { requestHint, startSession, submitAnswer } from "@/lib/tutor/engine";
import { decodeSession, encodeSession } from "@/lib/tutor/token";
import { toTurnView, type TurnView } from "@/lib/tutor/view";

/**
 * Заах engine-ийн ЦОРЫН ГАНЦ орох цэг.
 *
 * Server Action нь UI-аар дамжихгүйгээр шууд POST-оор дуудагдана — тиймээс
 * оролт бүрийг эндээс шалгана, клиентээс ирсэн зүйлд хэзээ ч итгэхгүй.
 * Session-ий төлөв гарын үсэгтэй token-оор ирнэ; хуурамч бол шинээр эхлүүлнэ.
 *
 * Phase 3-т эдгээрийн эхэнд хүүхдийн профайлын эзэмшлийн шалгалт нэмэгдэнэ.
 */

const problemIdSchema = z.string().min(1).max(64);
const tokenSchema = z.string().min(1).max(2048);
/** Хүүхдийн бичсэн хариулт — урт нь хязгаартай, эс бөгөөс prompt-ыг үер болгож болно */
const answerSchema = z.string().trim().min(1).max(120);
const modeSchema = z.enum(["tap", "text", "voice", "ink"]).default("tap");

export type ActionResult =
  | { ok: true; view: TurnView }
  | { ok: false; error: "not_found" | "bad_input" | "expired" };

export async function beginProblem(problemId: string): Promise<ActionResult> {
  const id = problemIdSchema.safeParse(problemId);
  if (!id.success) return { ok: false, error: "bad_input" };

  const problem = getProblem(id.data);
  if (!problem) return { ok: false, error: "not_found" };

  const reply = startSession(problem);
  return { ok: true, view: toTurnView(reply, encodeSession(reply.state)) };
}

export async function answerStep(
  token: string,
  raw: string,
  mode: unknown = "tap",
): Promise<ActionResult> {
  const parsed = z
    .object({ token: tokenSchema, raw: answerSchema, mode: modeSchema })
    .safeParse({ token, raw, mode });
  if (!parsed.success) return { ok: false, error: "bad_input" };

  const state = decodeSession(parsed.data.token);
  // Хуурамч эсвэл гэмтсэн token — хүүхдэд алдаа биш, дахин эхлүүлэх дохио.
  if (!state) return { ok: false, error: "expired" };

  const problem = getProblem(state.problemId);
  if (!problem) return { ok: false, error: "not_found" };

  const reply = submitAnswer(problem, state, parsed.data.raw, parsed.data.mode);
  // Phase 4: reply.newTurns-ийг энд DB рүү бичнэ.
  return { ok: true, view: toTurnView(reply, encodeSession(reply.state)) };
}

export async function askHint(token: string): Promise<ActionResult> {
  const parsed = tokenSchema.safeParse(token);
  if (!parsed.success) return { ok: false, error: "bad_input" };

  const state = decodeSession(parsed.data);
  if (!state) return { ok: false, error: "expired" };

  const problem = getProblem(state.problemId);
  if (!problem) return { ok: false, error: "not_found" };

  const reply = requestHint(problem, state);
  return { ok: true, view: toTurnView(reply, encodeSession(reply.state)) };
}
