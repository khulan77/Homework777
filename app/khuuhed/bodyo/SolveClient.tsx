"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Manuu } from "@/components/manuu/Manuu";
import { Bubble } from "@/components/manuu/Bubble";
import { NumberViz } from "@/components/shagai/Shagai";
import { Steppe, Khee } from "@/components/scene/Steppe";
import { Button, ButtonLink } from "@/components/ui/Button";
import { requestHint, startSession, submitAnswer, summarize } from "@/lib/tutor/engine";
import type { Problem, SessionState, TutorReply } from "@/lib/tutor/types";

export function SolveClient({
  problem,
  nextId,
}: {
  problem: Problem;
  nextId: string | null;
}) {
  const [reply, setReply] = useState<TutorReply>(() => startSession(problem));
  const [typing, setTyping] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const answer = useCallback(
    (value: string) => {
      if (reply.finished || typing) return;
      setPicked(value);
      const next = submitAnswer(problem, reply.state, value, "tap");
      setReply(next);
      // Зөв хариулсны дараа сонголтыг чөлөөлж, дараагийн алхмыг бэлдэнэ
      if (next.verdict === "correct") setTimeout(() => setPicked(null), 700);
    },
    [problem, reply.finished, reply.state, typing],
  );

  const hint = useCallback(() => {
    if (reply.finished) return;
    setReply(requestHint(problem, reply.state));
  }, [problem, reply.finished, reply.state]);

  const tone =
    reply.verdict === "correct" ? "good" : reply.verdict ? "warm" : "plain";

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-gradient-to-b from-sky-hi to-sky-lo">
      <Steppe />
      <Khee className="absolute inset-x-0 top-0 z-[2]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-4 pb-5 pt-5">
        <TopBar
          state={reply.state}
          total={problem.steps.length}
          backHref="/khuuhed"
        />

        <div className="flex max-w-2xl items-start gap-3">
          <Manuu
            mood={reply.mood}
            size="md"
            talking={typing}
            onTap={() => undefined}
            className="shrink-0"
          />
          <div className="mt-4 flex-1">
            <Bubble key={reply.say} text={reply.say} tone={tone} onTyping={setTyping} />
          </div>
        </div>

        <Equation problem={problem} filled={reply.fillSlot} />

        {reply.finished ? (
          <Finished
            state={reply.state}
            nextId={nextId}
          />
        ) : (
          <>
            <Options
              options={reply.options}
              picked={picked}
              verdict={reply.verdict}
              disabled={typing}
              onPick={answer}
            />
            <Tools onHint={hint} hintLevel={reply.state.hintLevel} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */

function TopBar({
  state,
  total,
  backHref,
}: {
  state: SessionState;
  total: number;
  backHref: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={backHref}
        aria-label="Буцах"
        className="press grid h-11 w-11 place-items-center rounded-full bg-glass text-xl shadow-[0_3px_0_rgb(27_46_62/0.12)] backdrop-blur-sm"
      >
        ←
      </Link>
      <div className="flex items-center gap-1.5" aria-label={`${total} алхмаас ${state.stepIndex + 1} дэх`}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`block h-2.5 w-7 rounded-full ${
              i < state.stepIndex ? "bg-grass" : i === state.stepIndex ? "bg-blue" : "bg-black/10"
            }`}
          />
        ))}
      </div>
      <button
        type="button"
        aria-label="Дахин уншуулах"
        className="press grid h-11 w-11 place-items-center rounded-full bg-glass text-lg shadow-[0_3px_0_rgb(27_46_62/0.12)] backdrop-blur-sm"
      >
        🔊
      </button>
    </div>
  );
}

function Slot({ value, filled }: { value: number | null; filled: string | null }) {
  return (
    <div
      className={`grid h-24 w-24 place-items-center rounded-[18px] border-[3px] font-display text-4xl font-bold tabular transition-all duration-300 ${
        filled
          ? "scale-105 border-grass bg-grass/20 text-grass-dk"
          : "border-dashed border-wood bg-white/55 text-wood-dk"
      }`}
    >
      {filled ?? value ?? "?"}
    </div>
  );
}

/** Тоог цифрээр БА шагайгаар зэрэг харуулна — concrete → abstract зам. */
function Term({ n }: { n: number }) {
  return (
    <div className="grid justify-items-center gap-1">
      <span className="font-display text-4xl font-bold tabular text-ink">{n}</span>
      <NumberViz value={n} />
    </div>
  );
}

function Equation({ problem, filled }: { problem: Problem; filled: string | null }) {
  const { left, op, right, result, blank } = problem.display;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-1">
      {blank === "left" ? <Slot value={left} filled={filled} /> : <Term n={left!} />}
      <span className="font-display text-4xl font-bold leading-none text-ink">{op}</span>
      {blank === "right" ? <Slot value={right} filled={filled} /> : <Term n={right!} />}
      <span className="font-display text-4xl font-bold leading-none text-ink">=</span>
      {blank === "result" ? <Slot value={result} filled={filled} /> : <Term n={result!} />}
    </div>
  );
}

function Options({
  options,
  picked,
  verdict,
  disabled,
  onPick,
}: {
  options: (number | string)[] | null;
  picked: string | null;
  verdict: TutorReply["verdict"];
  disabled: boolean;
  onPick: (v: string) => void;
}) {
  if (!options?.length) return null;

  return (
    <div className="mt-auto grid grid-cols-3 gap-2.5 pb-1">
      {options.map((o) => {
        const v = String(o);
        const isPicked = picked === v;
        // Буруу хариултад УЛААН биш ШАР. Хүүхэд шалгалт өгч байгаа мэт мэдрэхгүй.
        const state =
          isPicked && verdict === "correct"
            ? "border-grass bg-grass/15 text-grass-dk"
            : isPicked && verdict
              ? "border-sun bg-sun/15"
              : "border-line bg-card";
        return (
          <button
            key={v}
            type="button"
            disabled={disabled}
            onClick={() => onPick(v)}
            className={`press min-h-[64px] rounded-[18px] border-[2.5px] font-display text-2xl font-bold tabular text-ink shadow-[0_4px_0_var(--c-line)] active:shadow-[0_1px_0_var(--c-line)] disabled:opacity-60 ${state}`}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}

function Tools({ onHint, hintLevel }: { onHint: () => void; hintLevel: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 pb-2">
      <Button variant="sun" size="md" onClick={onHint} disabled={hintLevel >= 2}>
        💡 Тусла
      </Button>
      <Button variant="glass" size="md">🎤 Хэлэх</Button>
      <Button variant="glass" size="md">✍️ Бичих</Button>
    </div>
  );
}

function Finished({ state, nextId }: { state: SessionState; nextId: string | null }) {
  const s = summarize(state);
  const taughtOut = state.status === "taughtOut";

  return (
    <div className="mt-auto grid gap-3 pb-2">
      <div className="rounded-[20px] border-2 border-grass bg-glass p-4 backdrop-blur-sm">
        <p className="font-display text-xl font-bold text-ink">
          {taughtOut ? "Хамтдаа хийлээ 😊" : "Чи чадлаа! 🌟"}
        </p>
        <p className="mt-1 text-[15px] text-ink-2">
          {s.totalSteps} алхмаас <b className="text-ink">{s.unaidedSteps}</b>-ыг нь
          тусламжгүй өөрөө боджээ.
        </p>
      </div>
      {/* Дараагийн бодлого руу АВТОМАТААР шилжихгүй — хүүхэд өөрөө сонгоно */}
      <div className="grid gap-2 sm:grid-cols-2">
        {nextId ? (
          <ButtonLink
            href={`/khuuhed/bodyo?p=${nextId}`}
            variant="ghost"
            className="w-full"
          >
            Дараагийн бодлого →
          </ButtonLink>
        ) : null}
        <ButtonLink href="/khuuhed" variant="sun" className="w-full">
          Одоо амарья 👋
        </ButtonLink>
      </div>
    </div>
  );
}
