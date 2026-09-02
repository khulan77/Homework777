import { judge } from "./evaluator";
import type {
  Mood,
  Problem,
  SessionState,
  TutorReply,
  Turn,
  Verdict,
} from "./types";

/** Хэдэн удаа буруудсаны дараа Мануу өөрөө тайлбарлаж, гацаанаас гаргах вэ */
const TEACH_OUT_AFTER = 3;

function turn(
  role: Turn["role"],
  text: string,
  stepIndex: number,
  extra: Partial<Turn> = {},
): Turn {
  return { role, text, stepIndex, at: Date.now(), ...extra };
}

export function startSession(problem: Problem): TutorReply {
  const first = problem.steps[0];
  const state: SessionState = {
    problemId: problem.id,
    stepIndex: 0,
    wrongCount: 0,
    hintLevel: 0,
    unaidedSteps: 0,
    totalSteps: problem.steps.length,
    status: "active",
    startedAt: Date.now(),
  };
  return {
    state,
    newTurns: [turn("manuu", first.ask, 0)],
    say: first.ask,
    mood: "idle",
    verdict: null,
    options: first.options ?? null,
    finished: false,
    fillSlot: null,
  };
}

/** Хүүхэд "Тусла" дарлаа. Шат ахина, гэхдээ 2-оос хэтрэхгүй. */
export function requestHint(problem: Problem, state: SessionState): TutorReply {
  if (state.status !== "active") return idleReply(state);

  const step = problem.steps[state.stepIndex];
  const level = Math.min(state.hintLevel + 1, 2) as 1 | 2;
  const say = step.hints[level - 1];

  return {
    state: { ...state, hintLevel: level },
    newTurns: [turn("manuu", say, state.stepIndex)],
    say,
    mood: "think",
    verdict: null,
    options: step.options ?? null,
    finished: false,
    fillSlot: null,
  };
}

/**
 * Хүүхдийн хариултыг боловсруулна.
 *
 * Дүрэм:
 *  1. Зөв → баярлаж, дараагийн алхам руу.
 *  2. Танил алдаа → оношилсон зөөлөн хариу (загнахгүй).
 *  3. Танихгүй алдаа → тусламжийн шат ахина.
 *  4. 3 удаа буруудвал → Мануу тайлбарлаж, алхмыг ДУУСГАНА.
 *     Хүүхэд гацаанд үлдэхгүй. (Энэ нь анхны 10 дүрэмд дутуу байсан.)
 */
export function submitAnswer(
  problem: Problem,
  state: SessionState,
  raw: string,
  mode: Turn["mode"] = "tap",
): TutorReply {
  if (state.status !== "active") return idleReply(state);

  const step = problem.steps[state.stepIndex];
  const { verdict, nearMiss } = judge(step.expect, raw, step.nearMisses);
  const childTurn = turn("child", raw, state.stepIndex, { mode, verdict });

  if (verdict === "correct") {
    return advance(problem, state, [childTurn], step.celebrate, "joy", "correct");
  }

  const wrongCount = state.wrongCount + 1;

  if (wrongCount >= TEACH_OUT_AFTER) {
    return advance(
      problem,
      { ...state, wrongCount },
      [childTurn],
      step.teachOut,
      "calm",
      "wrong",
      /* taughtOut */ true,
    );
  }

  // Оношилсон хариу байвал түүнийг, үгүй бол дараагийн тусламж.
  const hintLevel = Math.min(state.hintLevel + 1, 2) as 1 | 2;
  const say = nearMiss ? nearMiss.reply : step.hints[hintLevel - 1];
  const mood: Mood = verdict === "near" ? "curious" : "think";

  return {
    state: { ...state, wrongCount, hintLevel },
    newTurns: [childTurn, turn("manuu", say, state.stepIndex)],
    say,
    mood,
    verdict,
    options: step.options ?? null,
    finished: false,
    fillSlot: null,
  };
}

/** Алхмыг хааж, дараагийнх руу шилжинэ (эсвэл бодлогыг дуусгана). */
function advance(
  problem: Problem,
  state: SessionState,
  turns: Turn[],
  say: string,
  mood: Mood,
  verdict: Verdict,
  taughtOut = false,
): TutorReply {
  const solvedUnaided = verdict === "correct" && state.hintLevel === 0;
  const unaidedSteps = state.unaidedSteps + (solvedUnaided ? 1 : 0);
  const stepIndex = state.stepIndex + 1;
  const isLast = stepIndex >= problem.steps.length;

  const newTurns = [...turns, turn("manuu", say, state.stepIndex)];

  if (isLast) {
    return {
      state: {
        ...state,
        stepIndex,
        unaidedSteps,
        status: taughtOut ? "taughtOut" : "solved",
      },
      newTurns,
      say,
      mood,
      verdict,
      options: null,
      finished: true,
      fillSlot: answerText(problem),
    };
  }

  const nextStep = problem.steps[stepIndex];
  return {
    state: { ...state, stepIndex, wrongCount: 0, hintLevel: 0, unaidedSteps },
    newTurns: [...newTurns, turn("manuu", nextStep.ask, stepIndex)],
    // Баяр хүргэсэн үг + дараагийн асуултыг НЭГ дор хэлнэ.
    say: `${say} ${nextStep.ask}`,
    mood,
    verdict,
    options: nextStep.options ?? null,
    finished: false,
    fillSlot: null,
  };
}

function idleReply(state: SessionState): TutorReply {
  return {
    state,
    newTurns: [],
    say: "",
    mood: "idle",
    verdict: null,
    options: null,
    finished: true,
    fillSlot: null,
  };
}

function answerText(problem: Problem): string {
  const a = problem.answer;
  if (a.kind === "number") return String(a.value);
  if (a.kind === "text") return a.accept[0];
  return a.values.join(", ");
}

/** Дүгнэлт — эцэг эхийн тайлан, "Дуусгав" дэлгэцэд хэрэглэнэ. */
export function summarize(state: SessionState) {
  return {
    unaidedSteps: state.unaidedSteps,
    totalSteps: state.totalSteps,
    /** North star: тусламжгүй бодсон хувь */
    unaidedRate:
      state.totalSteps === 0 ? 0 : state.unaidedSteps / state.totalSteps,
    durationMs: Date.now() - state.startedAt,
    status: state.status,
  };
}
