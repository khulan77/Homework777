/**
 * Item bank-ийн бүрэн бүтэн байдлын шалгалт.
 *
 * Item bank 80+ бодлого болоход алдааны ГОЛ эх сурвалж энэ болно: багш бодлого
 * бичихдээ сонголтод зөв хариугаа оруулахаа мартах, арифметик буруу бичих,
 * «буруу» гэсэн үг хэрэглэх гэх мэт. Эдгээрийг гараар барих боломжгүй.
 *
 * Эдгээр шалгалт нь кодын биш, КОНТЕНТЫН чанарыг хамгаална.
 */
import { describe, expect, test } from "bun:test";
import { PROBLEMS } from "./problems";
import { TOPICS } from "./topics";
import { check } from "@/lib/tutor/evaluator";
import type { AnswerSpec } from "@/lib/tutor/types";

function answerAsString(spec: AnswerSpec): string {
  if (spec.kind === "number") return String(spec.value);
  if (spec.kind === "text") return spec.accept[0];
  return spec.values.join(", ");
}

test("бодлогын ID давхардахгүй", () => {
  const ids = PROBLEMS.map((p) => p.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test("бодлого бүр байгаа сэдэвт харьяалагдана", () => {
  const topicIds = new Set(TOPICS.map((t) => t.id));
  for (const p of PROBLEMS) {
    expect(topicIds.has(p.topicId)).toBe(true);
  }
});

describe.each(PROBLEMS.map((p) => [p.id, p] as const))("%s", (_id, p) => {
  test("дор хаяж нэг алхамтай", () => {
    expect(p.steps.length).toBeGreaterThan(0);
  });

  test("арифметик нь дэлгэцийн харагдацтай тохирно", () => {
    // Хоосон нүдэнд эцсийн хариуг тавихад тэгшитгэл үнэн байх ёстой.
    const { left, op, right, result, blank } = p.display;
    const a = p.answer;
    if (a.kind !== "number") return;

    const L = blank === "left" ? a.value : left!;
    const R = blank === "right" ? a.value : right!;
    const Res = blank === "result" ? a.value : result!;
    expect(op === "+" ? L + R : L - R).toBe(Res);
  });

  test("сүүлийн алхмын хариулт нь бодлогын эцсийн хариу мөн", () => {
    // Эс бөгөөс хоосон нүдэнд буруу тоо бичигдэнэ.
    const last = p.steps[p.steps.length - 1];
    expect(check(last.expect, answerAsString(p.answer))).toBe(true);
  });

  describe.each(p.steps.map((s, i) => [i, s] as const))("алхам %i", (_i, step) => {
    test("асуулт, tusламж, teach-out, баяр хүргэлт бүгд бичигдсэн", () => {
      expect(step.ask.trim().length).toBeGreaterThan(0);
      expect(step.hints).toHaveLength(2);
      expect(step.hints[0].trim().length).toBeGreaterThan(0);
      expect(step.hints[1].trim().length).toBeGreaterThan(0);
      expect(step.teachOut.trim().length).toBeGreaterThan(0);
      expect(step.celebrate.trim().length).toBeGreaterThan(0);
    });

    test("сонголт өгсөн бол зөв хариулт нь дотор нь БАЙНА", () => {
      // Байхгүй бол хүүхэд зөв хариултаа товшиж чадахгүй — гацна.
      if (!step.options) return;
      const hit = step.options.some((o) => check(step.expect, String(o)));
      expect(hit).toBe(true);
    });

    test("танил алдаа нь зөв хариултай давхцахгүй", () => {
      // Давхцвал зөв хариултыг «ойрхон байна» гэж хэлэх байсан.
      for (const m of step.nearMisses ?? []) {
        expect(check(step.expect, String(m.value))).toBe(false);
      }
    });

    test("«буруу» гэсэн үг хэрэглээгүй", () => {
      // Бүтээгдэхүүний дүрэм: хүүхдийг загнахгүй, оношилно.
      const texts = [step.ask, step.teachOut, step.celebrate, ...step.hints];
      for (const m of step.nearMisses ?? []) texts.push(m.reply);
      for (const t of texts) {
        expect(t.toLocaleLowerCase("mn-MN")).not.toContain("буруу");
      }
    });

    test("Мануугийн өгүүлбэр хэт урт биш (бага ангийн хүүхэд)", () => {
      // 3–5-р ангид ~25 үг дээд хязгаар. Урт бол хүүхэд уншихаа болино.
      expect(step.ask.split(/\s+/).length).toBeLessThanOrEqual(25);
    });
  });
});
