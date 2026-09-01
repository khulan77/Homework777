"use client";

import { useState, useSyncExternalStore } from "react";
import { Manuu } from "@/components/manuu/Manuu";
import { Bubble } from "@/components/manuu/Bubble";
import type { Mood } from "@/lib/tutor/types";

/**
 * Мануугийн угтах үг цагаас хамаарна.
 * Нэг ижил мэндчилгээ давтагдахгүй байх нь "санаж байна" гэсэн мэдрэмж өгнө —
 * push notification-оос хавьгүй хүчтэй эргэж ирэх шалтгаан.
 */
function greet(childName: string, lastTopic: string | null, hour: number) {
  if (hour >= 22 || hour < 5) {
    return {
      hi: `${childName} аа 🌙`,
      line: "Оройтжээ. Богинохон нэг бодлого бодоод унтъя, за юу?",
      mood: "calm" as Mood,
    };
  }
  const hi =
    hour < 11
      ? `Өглөөний мэнд, ${childName}! ☀️`
      : hour < 17
        ? `Сайн уу, ${childName}! 👋`
        : `Оройн мэнд, ${childName}! 🌙`;
  return {
    hi,
    line: lastTopic
      ? `Өчигдөр чи ${lastTopic}-ыг сайн бодсон шүү 😊 Өнөөдөр үргэлжлүүлэх үү?`
      : "Өнөөдөр ямар даалгавар хийх вэ?",
    mood: "idle" as Mood,
  };
}

/**
 * Клиентийн орон нутгийн цагийг УНШИНА.
 *
 * Сервер дээр уншвал хуудас кэшлэгдэж, өөр цагийн бүсийн хүүхдэд буруу мэндчилнэ.
 * Snapshot-ыг нэг л удаа тооцоолж хадгална — үгүй бол React төгсгөлгүй давтана.
 */
const NEVER = () => () => {};
let cachedHour: number | null = null;
let cachedDow: number | null = null;
const clientHour = () => (cachedHour ??= new Date().getHours());
const clientDow = () => (cachedDow ??= (new Date().getDay() + 6) % 7);
const serverNull = () => null;

export function Greeting({
  childName,
  lastTopic,
}: {
  childName: string;
  lastTopic: string | null;
}) {
  const hour = useSyncExternalStore(NEVER, clientHour, serverNull);
  const [typing, setTyping] = useState(false);
  const g = hour === null ? null : greet(childName, lastTopic, hour);

  return (
    <div className="flex max-w-2xl items-start gap-3">
      <Manuu
        mood={g?.mood ?? "idle"}
        size="lg"
        waving
        talking={typing}
        className="shrink-0"
      />
      <div className="mt-8 flex-1">
        <div className="relative min-h-[80px] rounded-[20px] border-2 border-transparent bg-glass px-4 py-3 shadow-[0_8px_22px_-12px_rgb(27_46_62/0.55)] backdrop-blur-sm">
          <span
            aria-hidden
            className="absolute -left-2.5 top-6 h-4 w-4 rotate-45 rounded-bl-[5px] border-b-2 border-l-2 border-inherit bg-glass"
          />
          <p className="font-display text-xl font-bold text-ink">{g?.hi ?? " "}</p>
          <div className="mt-0.5">
            {g ? <Bubble key={g.line} text={g.line} onTyping={setTyping} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 7 хоногийн цэгүүд — ирсэн өдрийг тэмдэглэнэ. Алдсаныг УЛААНААР тэмдэглэхгүй. */
export function WeekDots({ done }: { done: boolean[] }) {
  const today = useSyncExternalStore(NEVER, clientDow, serverNull);

  return (
    <div className="flex items-center gap-2.5 rounded-full bg-glass px-3.5 py-1.5 shadow-[0_3px_0_rgb(27_46_62/0.1)] backdrop-blur-sm">
      <span className="text-xs font-semibold text-ink-2">Энэ 7 хоног</span>
      <span className="flex gap-1">
        {done.map((d, i) => (
          <span
            key={i}
            className={`block h-2.5 w-2.5 rounded-full ${d ? "bg-grass" : "bg-black/15"} ${
              i === today ? "outline-2 outline-offset-2 outline-blue" : ""
            }`}
          />
        ))}
      </span>
    </div>
  );
}
