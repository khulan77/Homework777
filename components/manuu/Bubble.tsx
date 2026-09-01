"use client";

import { useEffect, useState } from "react";

type Tone = "plain" | "good" | "warm";

const TONE: Record<Tone, string> = {
  plain: "border-transparent",
  good: "border-grass",
  warm: "border-sun",
};

/**
 * Мануугийн ярианы бөмбөлөг.
 *
 * ЧУХАЛ: энэ бол тусдаа "чат блок" БИШ. Мануугийн үг өөрөө чат.
 * ChatGPT маягийн урт урсгал 7 настай хүүхдэд хэт их.
 *
 * Шинэ өгүүлбэр бүрд `key={text}` өгч дахин үүсгэнэ — ингэснээр бичих
 * тоолуур 0-ээс эхэлж, effect дотор синхрон setState хийх шаардлагагүй.
 */
export function Bubble({
  text,
  tone = "plain",
  onTyping,
}: {
  text: string;
  tone?: Tone;
  onTyping?: (typing: boolean) => void;
}) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [count, setCount] = useState(reduce ? text.length : 0);

  useEffect(() => {
    if (count >= text.length) {
      onTyping?.(false);
      return;
    }
    onTyping?.(true);
    const id = setInterval(() => {
      setCount((c) => {
        if (c + 1 >= text.length) clearInterval(id);
        return c + 1;
      });
    }, 19);
    return () => clearInterval(id);
    // count-г зориудаар хамааралд оруулаагүй — интервал өөрөө ахиулна.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text.length]);

  return (
    <div
      aria-live="polite"
      className={`relative min-h-[72px] rounded-[20px] border-2 bg-glass px-4 py-3 shadow-[0_8px_22px_-12px_rgb(27_46_62/0.55)] backdrop-blur-sm ${TONE[tone]}`}
    >
      <span
        aria-hidden
        className="absolute -left-2.5 top-6 h-4 w-4 rotate-45 rounded-bl-[5px] border-b-2 border-l-2 border-inherit bg-glass"
      />
      <p className="text-[16px] font-medium text-ink">{text.slice(0, count)}</p>
    </div>
  );
}
