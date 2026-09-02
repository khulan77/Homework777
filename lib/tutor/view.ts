import type { Mood, Problem, ProblemDisplay, TutorReply, Verdict } from "./types";

/**
 * Клиент рүү явах өгөгдлийн ЦОРЫН ГАНЦ хэлбэр.
 *
 * Бүтээгдэхүүний гол амлалт бол «Мануу хариуг хэлдэггүй». Хэрэв бүтэн `Problem`
 * объектыг props-оор явуулбал DevTools нээсэн хүүхэд `answer`, `hints`,
 * `nearMisses`, `teachOut` бүгдийг харна — амлалт техникийн хувьд худал болно.
 *
 * Тиймээс энэ файл дахь хоёр функц нь хилийн шалган нэвтрүүлэх цэг:
 * зөвхөн эдгээр талбар л клиент рүү гарна. Шинэ талбар нэмэхээсээ өмнө
 * "энэ нь хариуг задруулж байна уу?" гэж асуу.
 */

/** Дэлгэц дээрх бодлого — хариулт БАЙХГҮЙ */
export interface ProblemView {
  id: string;
  promptMn: string;
  display: ProblemDisplay;
  totalSteps: number;
}

/** Нэг харилцан үйлдлийн үр дүн — hint-ийн ЭХ БИЧВЭР биш, зөвхөн одоо хэлэх үг */
export interface TurnView {
  say: string;
  mood: Mood;
  verdict: Verdict | null;
  options: (number | string)[] | null;
  stepIndex: number;
  totalSteps: number;
  hintLevel: number;
  /** Дахин hint авах боломжтой эсэх */
  canHint: boolean;
  finished: boolean;
  /** Хоосон нүдэнд бичих утга — ЗӨВХӨН бодлого дуссаны дараа */
  fillSlot: string | null;
  summary: { unaidedSteps: number; totalSteps: number; taughtOut: boolean } | null;
  /** Гарын үсэгтэй төлөв — дараагийн дуудлагад буцааж илгээнэ */
  token: string;
}

export function toProblemView(problem: Problem): ProblemView {
  return {
    id: problem.id,
    promptMn: problem.promptMn,
    display: problem.display,
    totalSteps: problem.steps.length,
  };
}

export function toTurnView(reply: TutorReply, token: string): TurnView {
  const { state } = reply;
  return {
    say: reply.say,
    mood: reply.mood,
    verdict: reply.verdict,
    options: reply.options,
    stepIndex: state.stepIndex,
    totalSteps: state.totalSteps,
    hintLevel: state.hintLevel,
    canHint: state.status === "active" && state.hintLevel < 2,
    finished: reply.finished,
    fillSlot: reply.fillSlot,
    summary: reply.finished
      ? {
          unaidedSteps: state.unaidedSteps,
          totalSteps: state.totalSteps,
          taughtOut: state.status === "taughtOut",
        }
      : null,
    token,
  };
}
