/**
 * Engine-ийн зан төлөвийн шалгалт.  Ажиллуулах:  bun test
 *
 * Энд шалгаж буй зүйлс нь UI биш, БҮТЭЭГДЭХҮҮНИЙ АМЛАЛТ:
 *   · Хүүхэд хэзээ ч гацаанд үлдэхгүй (teach-out).
 *   · Тусламж авсан алхам "өөрөө бодсон" гэж тоологдохгүй (north star цэвэр).
 *   · Буруу хариултад ерөнхий "буруу" биш, оношилсон үг гарна.
 */
import { expect, test } from "bun:test";
import { getProblem } from "@/lib/content/problems";
import { requestHint, startSession, submitAnswer, summarize } from "./engine";
import { judge } from "./evaluator";
import type { AnswerSpec } from "./types";

const problem = getProblem("p-3-002")!; // 24 + 18 = □

test("session нь эхний алхмын асуултаас эхэлнэ", () => {
  const r = startSession(problem);
  expect(r.say).toBe(problem.steps[0].ask);
  expect(r.options).toEqual([30, 34, 44]);
  expect(r.finished).toBe(false);
});

test("зөв хариулбал дараагийн алхам руу шилжинэ", () => {
  const r = submitAnswer(problem, startSession(problem).state, "34");
  expect(r.verdict).toBe("correct");
  expect(r.state.stepIndex).toBe(1);
  expect(r.state.unaidedSteps).toBe(1);
  expect(r.mood).toBe("joy");
});

test("танил алдаанд оношилсон хариу өгнө, ерөнхий 'буруу' биш", () => {
  const r = submitAnswer(problem, startSession(problem).state, "44");
  expect(r.verdict).toBe("near");
  expect(r.say).toContain("20 нэмчихэж");
  expect(r.say).not.toContain("буруу");
});

test("гурав дахь алдааны дараа Мануу тайлбарлаж, алхмыг ДУУСГАНА", () => {
  let s = startSession(problem).state;
  for (const wrong of ["44", "30", "99"]) {
    s = submitAnswer(problem, s, wrong).state;
  }
  // Хүүхэд гацаанд үлдээгүй — дараагийн алхам руу гарсан
  expect(s.stepIndex).toBe(1);
  expect(s.unaidedSteps).toBe(0);
});

test("тусламж авсан алхам 'өөрөө бодсон' гэж тоологдохгүй", () => {
  let s = startSession(problem).state;
  s = requestHint(problem, s).state;
  s = submitAnswer(problem, s, "34").state;
  expect(s.stepIndex).toBe(1);
  expect(s.unaidedSteps).toBe(0); // hint авсан тул тоологдохгүй
});

test("hint 2-оос цааш ахихгүй — эцсийн хариуг задруулахгүй", () => {
  let s = startSession(problem).state;
  s = requestHint(problem, s).state;
  s = requestHint(problem, s).state;
  const third = requestHint(problem, s);
  expect(third.state.hintLevel).toBe(2);
  expect(third.say).toBe(problem.steps[0].hints[1]);
});

test("бүх алхам дуусахад бодлого шийдэгдэж, хариу хайрцагт орно", () => {
  let s = startSession(problem).state;
  s = submitAnswer(problem, s, "34").state;
  const last = submitAnswer(problem, s, "42");
  expect(last.finished).toBe(true);
  expect(last.state.status).toBe("solved");
  expect(last.fillSlot).toBe("42");
  expect(summarize(last.state).unaidedRate).toBe(1);
});

test("evaluator: зөвхөн яг тохирсон тоог зөв гэнэ", () => {
  const spec: AnswerSpec = { kind: "number", value: 42 };
  expect(judge(spec, "42").verdict).toBe("correct");
  expect(judge(spec, " 42 ").verdict).toBe("correct");
  expect(judge(spec, "42-той").verdict).toBe("correct"); // цифрийг ялгаж уншина
  expect(judge(spec, "41").verdict).toBe("wrong");
  expect(judge(spec, "").verdict).toBe("wrong");
});

test("evaluator: монгол текстийг том/жижиг үсэг, цэг үл харгалзан шалгана", () => {
  const spec: AnswerSpec = { kind: "text", accept: ["нэмэх", "нэмнэ"] };
  expect(judge(spec, "Нэмэх.").verdict).toBe("correct");
  expect(judge(spec, "  НЭМНЭ  ").verdict).toBe("correct");
  expect(judge(spec, "хасах").verdict).toBe("wrong");
});
