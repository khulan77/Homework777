/**
 * LLM provider-ийн хийсвэрлэл.
 *
 * ЧУХАЛ: LLM нь зөв хариуг ХЭЗЭЭ Ч тодорхойлохгүй. Түүнийг lib/tutor/evaluator.ts
 * хийнэ. LLM зөвхөн хоёр нарийн ажил хийнэ:
 *   1. Хүүхдийн задгай текстийг ойлгож, зорилгыг нь гаргах.
 *   2. Урьдчилан бичсэн hint-ийг хүүхдийн үгэнд тааруулж дахин найруулах.
 *
 * MVP-д хоёулаа ажиллахгүй байсан ч бүтээгдэхүүн бүрэн ажиллана —
 * бэлэн hint шууд хэрэглэгдэнэ. Энэ нь зардлыг тэглэж, найдвартай байдлыг өгнө.
 */

import type { Grade } from "@/lib/tutor/types";

export interface RephraseInput {
  /** Багшийн бичсэн эх hint */
  hint: string;
  /** Хүүхэд юу гэж хариулсан */
  childSaid: string;
  grade: Grade;
  childName: string;
}

export interface InterpretInput {
  /** Хүүхдийн задгай бичсэн/хэлсэн текст */
  raw: string;
  /** Хүлээж буй хариултын төрөл */
  expecting: "number" | "text";
  grade: Grade;
}

export interface LLMProvider {
  readonly name: string;
  /** Задгай текстээс хариултыг ялгаж авна. Чадаагүй бол null. */
  interpret(input: InterpretInput): Promise<string | null>;
  /** Hint-ийг найруулна. Алдаа гарвал эх hint-ийг буцаана. */
  rephrase(input: RephraseInput): Promise<string>;
}

/**
 * Анхдагч: LLM огт дуудахгүй. Бэлэн hint-ийг шууд хэрэглэнэ.
 * Тоон хариултыг regex-ээр уншина — 3-5-р ангийн математикт энэ 95% тохиолдолд хангалттай.
 */
export const offlineProvider: LLMProvider = {
  name: "offline",
  async interpret({ raw, expecting }) {
    if (expecting === "number") {
      const m = raw.match(/-?\d+/);
      return m ? m[0] : null;
    }
    return raw.trim() || null;
  },
  async rephrase({ hint }) {
    return hint;
  },
};

let active: LLMProvider = offlineProvider;

export function setLLMProvider(p: LLMProvider) {
  active = p;
}

export function llm(): LLMProvider {
  return active;
}
