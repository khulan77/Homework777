import type { AnswerSpec, Verdict, NearMiss } from "./types";

/** Хүүхдийн бичсэн текстийг цэвэрлэнэ (зай, том жижиг үсэг, монгол цэг). */
export function normalize(raw: string): string {
  return raw
    .trim()
    .toLocaleLowerCase("mn-MN")
    .replace(/[.,!?;:"'`]+$/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Эхний тоог ялгаж авна.
 *
 * Хүүхэд "42" гэж цэвэрхэн бичихээс илүү "42 гэж бодлоо", "хариу нь 42",
 * "42-той" гэж бичих нь элбэг. Цифр биш тэмдэгтийг зүгээр устгавал
 * "42-той" → "42-" → NaN болно, тиймээс regex-ээр ялгаж авна.
 */
export function toNumber(raw: string): number | null {
  const m = normalize(raw).match(/-?\d+/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Хариултыг шалгана. ЭНЭ БОЛ ЦОРЫН ГАНЦ ҮНЭНИЙ ЭХ СУРВАЛЖ.
 * LLM энд оролцохгүй.
 */
export function check(spec: AnswerSpec, raw: string): boolean {
  switch (spec.kind) {
    case "number": {
      const n = toNumber(raw);
      return n !== null && n === spec.value;
    }
    case "text": {
      const t = normalize(raw);
      return spec.accept.some((a) => normalize(a) === t);
    }
    case "sequence": {
      const parts = normalize(raw)
        .split(/[\s,]+/)
        .map((p) => Number(p.replace(/[^\d-]/g, "")));
      return (
        parts.length === spec.values.length &&
        parts.every((p, i) => p === spec.values[i])
      );
    }
  }
}

/**
 * Буруу хариулт нь урьдчилан бичсэн "танил алдаа" мөн эсэхийг олно.
 * Олдвол Мануу оношилсон хариу өгнө — ерөнхий "буруу байна" биш.
 */
export function findNearMiss(
  raw: string,
  nearMisses?: NearMiss[],
): NearMiss | null {
  if (!nearMisses?.length) return null;
  const t = normalize(raw);
  const n = toNumber(raw);
  return (
    nearMisses.find((m) =>
      typeof m.value === "number" ? n === m.value : normalize(m.value) === t,
    ) ?? null
  );
}

export function judge(
  spec: AnswerSpec,
  raw: string,
  nearMisses?: NearMiss[],
): { verdict: Verdict; nearMiss: NearMiss | null } {
  if (check(spec, raw)) return { verdict: "correct", nearMiss: null };
  const nearMiss = findNearMiss(raw, nearMisses);
  return { verdict: nearMiss ? "near" : "wrong", nearMiss };
}
