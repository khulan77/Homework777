"use client";

import { useCallback, useState } from "react";

/**
 * Шагай — тоолох нэгж.
 *
 * Minecraft-ийн блок биш. Монгол хүүхэд шагайгаар тоолж, тоглож өсдөг —
 * гарт нь аль хэдийн танил зүйл. Модон тавиур бүр 10 шагай = аравтын орон.
 */
function Bone({ lit }: { lit: boolean }) {
  return (
    <svg
      viewBox="0 0 20 24"
      aria-hidden
      className={`block h-[18px] w-[15px] transition-transform duration-200 ${
        lit ? "scale-[1.35] drop-shadow-[0_0_5px_var(--c-sun)]" : ""
      }`}
    >
      <path
        d="M4.4 3.2Q10 .4 15.6 3.2Q19 7.4 15.8 11.6Q19.2 16.4 15.6 20.8Q10 23.6 4.4 20.8Q.8 16.4 4.2 11.6Q1 7.4 4.4 3.2Z"
        fill="var(--c-bone)"
        stroke="var(--c-bone-ln)"
        strokeWidth="1.1"
      />
      <path
        d="M6.6 11.8q3.4 1.4 6.8 0"
        stroke="var(--c-bone-sh)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Group({
  groupKey,
  count,
  label,
  cols,
  tray,
  lit,
  onCount,
}: {
  groupKey: string;
  count: number;
  label: string;
  cols: number;
  tray: boolean;
  lit: ReadonlySet<string>;
  onCount: ((groupKey: string, size: number) => void) | null;
}) {
  const shell = tray
    ? "rounded-lg bg-gradient-to-b from-wood to-wood-dk p-1 shadow-[0_2px_0_rgb(0_0_0/0.18)] hover:-translate-y-0.5"
    : "content-end";
  const style = { gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` };

  const bones = Array.from({ length: count }, (_, i) => (
    <Bone key={i} lit={lit.has(`${groupKey}-${i}`)} />
  ));
  const badge = (
    <span className="absolute inset-x-0 -bottom-4 text-center text-[10.5px] font-semibold text-ink-2">
      {label}
    </span>
  );

  if (!onCount) {
    return (
      <div className={`relative grid gap-[2px] ${shell}`} style={style}>
        {bones}
        {badge}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onCount(groupKey, count)}
      aria-label={`${label} шагай — тоолох`}
      className={`relative grid gap-[2px] transition-transform ${shell}`}
      style={style}
    >
      {bones}
      {badge}
    </button>
  );
}

/**
 * Тоог шагайгаар дүрсэлнэ. 24 = 2 тавиур + 4 шагай.
 * Дарвал нэг нэгээр тоолж өгнө — аравтын ойлголт нүдээр суудаг.
 */
export function NumberViz({
  value,
  interactive = true,
  className = "",
}: {
  value: number;
  interactive?: boolean;
  className?: string;
}) {
  const [lit, setLit] = useState<ReadonlySet<string>>(() => new Set<string>());
  const tens = Math.floor(value / 10);
  const ones = value % 10;

  const countOut = useCallback((groupKey: string, size: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < size; i++) {
      const id = `${groupKey}-${i}`;
      setTimeout(() => {
        setLit((s) => new Set(s).add(id));
        setTimeout(
          () =>
            setLit((s) => {
              const n = new Set(s);
              n.delete(id);
              return n;
            }),
          300,
        );
      }, i * 120);
    }
  }, []);

  const onCount = interactive ? countOut : null;

  return (
    <div className={`flex flex-wrap items-end justify-center gap-1.5 pb-4 ${className}`}>
      {Array.from({ length: tens }, (_, t) => (
        <Group
          key={t}
          groupKey={`t${t}`}
          count={10}
          label="10"
          cols={2}
          tray
          lit={lit}
          onCount={onCount}
        />
      ))}
      {ones > 0 && (
        <Group
          groupKey="ones"
          count={ones}
          label={String(ones)}
          cols={5}
          tray={false}
          lit={lit}
          onCount={onCount}
        />
      )}
    </div>
  );
}
