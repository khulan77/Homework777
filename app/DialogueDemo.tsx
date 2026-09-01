"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Manuu } from "@/components/manuu/Manuu";

/** Тайлбарлахын оронд ҮЗҮҮЛНЭ — landing page-ийн зүрх. */
const SCRIPT: { who: "kid" | "manuu"; text: string; hi?: boolean }[] = [
  { who: "kid", text: "24 + 18 хэд вэ?" },
  { who: "manuu", text: "За хамтдаа бодъё 😊 Эхлээд 24 дээр 10 нэмбэл хэд болох вэ?" },
  { who: "kid", text: "44" },
  { who: "manuu", text: "Ойрхон байна! Чи 20 нэмчихэж. Бид 10 нэмэх гэсэн юм — аравтын орон дээр нэг нэмнэ." },
  { who: "kid", text: "34" },
  { who: "manuu", text: "Яг зөв! 🎉 Одоо үлдсэн 8-ыг нэмье. 34 + 8 хэд вэ?" },
  { who: "kid", text: "42" },
  { who: "manuu", text: "Чи чадлаа! 24 + 18 = 42. Өөрөө бодож оллоо шүү дээ 💪", hi: true },
];

export function DialogueDemo() {
  const [shown, setShown] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  const play = useCallback(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setShown(SCRIPT.length);
    setShown(0);
    SCRIPT.forEach((_, i) => setTimeout(() => setShown(i + 1), 220 + i * 820));
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  return (
    <div
      ref={box}
      className="relative mt-7 overflow-hidden rounded-[28px] bg-gradient-to-b from-sky-hi to-sky-lo px-5 py-7 shadow-xl"
    >
      <div className="mx-auto grid min-h-[330px] max-w-xl gap-3">
        {SCRIPT.map((t, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 transition-all duration-500 ${
              i < shown ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
            } ${t.who === "kid" ? "flex-row-reverse" : ""}`}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#F0DFC6] shadow-[0_3px_0_rgb(27_46_62/0.14)]">
              {t.who === "kid" ? <span className="text-xl">🧒</span> : <Manuu size="sm" />}
            </span>
            <span
              className={`max-w-[80%] rounded-[18px] px-4 py-2.5 text-[16px] font-medium shadow-md ${
                t.who === "kid"
                  ? "bg-sun text-[#4A3200]"
                  : t.hi
                    ? "border-2 border-grass bg-[#DFF5EC] text-[#1B4635]"
                    : "bg-white text-[#1B2E3E]"
              }`}
            >
              {t.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={play}
          className="press rounded-[13px] border-2 border-white bg-white/90 px-4 py-2 text-sm font-semibold text-[#1B2E3E] shadow-[0_3px_0_rgb(27_46_62/0.14)]"
        >
          ↻ Дахин үзэх
        </button>
      </div>
    </div>
  );
}
