"use client";

import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import { Manuu } from "@/components/manuu/Manuu";
import { Bubble } from "@/components/manuu/Bubble";
import { NumberViz } from "@/components/shagai/Shagai";
import { Steppe, Khee } from "@/components/scene/Steppe";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { ProblemView, TurnView } from "@/lib/tutor/view";
import { answerStep, askHint, type ActionResult } from "./actions";

/**
 * Бодох дэлгэц.
 *
 * Энэ компонент зөв хариуг МЭДЭХГҮЙ. Бүх шийдвэр сервер дээр гарна
 * (app/khuuhed/bodyo/actions.ts). Энд байгаа зүйл нь Мануугийн хэлсэн үг,
 * товшихад бэлэн сонголтууд, гарын үсэгтэй token — өөр юу ч биш.
 */
export function SolveClient({
  problem,
  initial,
  nextId,
}: {
  problem: ProblemView;
  initial: TurnView;
  nextId: string | null;
}) {
  const [view, setView] = useState<TurnView>(initial);
  const [typing, setTyping] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();

  const apply = useCallback((res: ActionResult) => {
    if (res.ok) {
      setFailed(false);
      setView(res.view);
    } else {
      // Хүүхдэд техникийн алдаа харуулахгүй — Мануу л ярина.
      setFailed(true);
    }
  }, []);

  const answer = useCallback(
    (value: string) => {
      if (view.finished || typing || pending) return;
      setPicked(value);
      start(async () => {
        const res = await answerStep(view.token, value, "tap");
        apply(res);
        if (res.ok && res.view.verdict === "correct") setPicked(null);
      });
    },
    [apply, pending, typing, view.finished, view.token],
  );

  const hint = useCallback(() => {
    if (view.finished || pending) return;
    start(async () => apply(await askHint(view.token)));
  }, [apply, pending, view.finished, view.token]);

  const tone =
    view.verdict === "correct" ? "good" : view.verdict ? "warm" : "plain";
  const say = failed
    ? "Жаахан бодоод байна… Дахиад нэг дарж үзээрэй 😊"
    : view.say;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-gradient-to-b from-sky-hi to-sky-lo">
      <Steppe />
      <Khee className="absolute inset-x-0 top-0 z-[2]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-4 pb-5 pt-5">
        <TopBar stepIndex={view.stepIndex} total={view.totalSteps} />

        <div className="flex max-w-2xl items-start gap-3">
          <Manuu
            mood={pending ? "think" : view.mood}
            size="md"
            talking={typing}
            className="shrink-0"
          />
          <div className="mt-4 flex-1">
            <Bubble key={say} text={say} tone={failed ? "warm" : tone} onTyping={setTyping} />
          </div>
        </div>

        <Equation problem={problem} filled={view.fillSlot} />

        {view.finished ? (
          <Finished summary={view.summary} nextId={nextId} />
        ) : (
          <>
            <Options
              options={view.options}
              picked={picked}
              verdict={view.verdict}
              disabled={typing || pending}
              onPick={answer}
            />
            <Tools onHint={hint} canHint={view.canHint && !pending} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */

function TopBar({ stepIndex, total }: { stepIndex: number; total: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href="/khuuhed"
        aria-label="Буцах"
        className="press grid h-11 w-11 place-items-center rounded-full bg-glass text-xl shadow-[0_3px_0_rgb(27_46_62/0.12)] backdrop-blur-sm"
      >
        ←
      </Link>
      <div
        className="flex items-center gap-1.5"
        aria-label={`${total} алхмаас ${Math.min(stepIndex + 1, total)} дэх`}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`block h-2.5 w-7 rounded-full ${
              i < stepIndex ? "bg-grass" : i === stepIndex ? "bg-blue" : "bg-black/10"
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

function Equation({
  problem,
  filled,
}: {
  problem: ProblemView;
  filled: string | null;
}) {
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
  verdict: TurnView["verdict"];
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

function Tools({ onHint, canHint }: { onHint: () => void; canHint: boolean }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 pb-2">
      <Button variant="sun" size="md" onClick={onHint} disabled={!canHint}>
        💡 Тусла
      </Button>
      <Button variant="glass" size="md">🎤 Хэлэх</Button>
      <Button variant="glass" size="md">✍️ Бичих</Button>
    </div>
  );
}

function Finished({
  summary,
  nextId,
}: {
  summary: TurnView["summary"];
  nextId: string | null;
}) {
  return (
    <div className="mt-auto grid gap-3 pb-2">
      <div className="rounded-[20px] border-2 border-grass bg-glass p-4 backdrop-blur-sm">
        <p className="font-display text-xl font-bold text-ink">
          {summary?.taughtOut ? "Хамтдаа хийлээ 😊" : "Чи чадлаа! 🌟"}
        </p>
        {summary && (
          <p className="mt-1 text-[15px] text-ink-2">
            {summary.totalSteps} алхмаас{" "}
            <b className="text-ink">{summary.unaidedSteps}</b>-ыг нь тусламжгүй
            өөрөө боджээ.
          </p>
        )}
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
