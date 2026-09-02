/**
 * Мануугийн хувцаснууд.
 *
 * Урамшуулал нь ОНОО биш, ХУВЦАС. Хүүхэд «би 20 оноотой» гэхээс «Мануу маань
 * сансрын хувцастай боллоо» гэж хэлэх нь хамаагүй илүү хүчтэй — тоо биш,
 * түүх болно. Мөн тоо цуглуулах даралт үүсгэхгүй.
 */
export const COSTUMES = {
  none: { id: "none", nameMn: "Энгийн", emoji: "🐱" },
  deel: { id: "deel", nameMn: "Дээлтэй", emoji: "🧥" },
  space: { id: "space", nameMn: "Сансрын", emoji: "🚀" },
  zodog: { id: "zodog", nameMn: "Бөхийн", emoji: "🤼" },
} as const;

export type CostumeId = keyof typeof COSTUMES;

export const COSTUME_LIST = Object.values(COSTUMES);

export function isCostumeId(v: string): v is CostumeId {
  return v in COSTUMES;
}
