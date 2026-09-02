/**
 * Серверийн хилийн шалгалт.
 *
 * Энд шалгаж буй зүйл бол бүтээгдэхүүний ГОЛ АМЛАЛТ: «Мануу хариуг хэлдэггүй».
 * Хэрэв клиент рүү явах өгөгдөлд хариулт, hint, оношилгоо орвол энэ амлалт
 * техникийн хувьд худал болно — DevTools нээсэн хүүхэд бүгдийг харна.
 *
 * Тиймээс эдгээр тест унавал шинэ талбар нэмэхээ зогсоо, view.ts-ээ засаарай.
 */
import { expect, test } from "bun:test";
import { getProblem } from "@/lib/content/problems";
import { startSession, submitAnswer } from "./engine";
import { decodeSession, encodeSession } from "./token";
import { toProblemView, toTurnView } from "./view";

const problem = getProblem("p-3-002")!; // 24 + 18 = □, хариу 42

/** Клиент рүү явах бүх зүйлийг нэг мөр текст болгоно */
function wireFormat(value: unknown): string {
  return JSON.stringify(value);
}

test("ProblemView-д зөв хариу байхгүй", () => {
  const wire = wireFormat(toProblemView(problem));
  expect(wire).not.toContain('"answer"');
  expect(wire).not.toContain('"expect"');
  expect(wire).not.toContain("hints");
  expect(wire).not.toContain("nearMisses");
  expect(wire).not.toContain("teachOut");
  expect(wire).not.toContain("celebrate");
  // Хоосон нүд хоосон хэвээр — эцсийн хариу (42) бүтэцчилэн ч гарахгүй
  const view = toProblemView(problem);
  expect(view.display.result).toBeNull();
  expect(Object.keys(view).sort()).toEqual([
    "display",
    "id",
    "promptMn",
    "totalSteps",
  ]);
});

test("эхний TurnView-д зөвхөн одоогийн асуулт ба сонголтууд байна", () => {
  const reply = startSession(problem);
  const view = toTurnView(reply, encodeSession(reply.state));
  const wire = wireFormat(view);

  expect(view.say).toBe(problem.steps[0].ask);
  expect(view.options).toEqual([30, 34, 44]);
  // Дараагийн алхмуудын асуулт, hint аль нь ч урьдчилж гарахгүй
  expect(wire).not.toContain(problem.steps[1].ask);
  expect(wire).not.toContain(problem.steps[0].hints[0]);
  expect(wire).not.toContain(problem.steps[0].teachOut);
  expect(view.fillSlot).toBeNull();
});

test("хариу нь ЗӨВХӨН бодлого дууссаны дараа fillSlot-оор гарна", () => {
  const first = startSession(problem);
  const mid = submitAnswer(problem, first.state, "34");
  expect(toTurnView(mid, encodeSession(mid.state)).fillSlot).toBeNull();

  const done = submitAnswer(problem, mid.state, "42");
  expect(toTurnView(done, encodeSession(done.state)).fillSlot).toBe("42");
});

test("token-д хариулт байхгүй — задалж уншсан ч хариу олдохгүй", () => {
  const reply = startSession(problem);
  const token = encodeSession(reply.state);
  const payload: Record<string, unknown> = JSON.parse(
    Buffer.from(token.split(".")[0], "base64url").toString(),
  );

  /*
   * Талбарын жагсаалтыг ЯГ шалгана. Хэн нэгэн SessionState-д хариултай холбоотой
   * талбар (ж: `expectedAnswer`) нэмбэл энэ тест унана.
   *
   * Дэд мөрөөр шалгаж БОЛОХГҮЙ: `startedAt` нь миллисекундын тоо тул дотор нь
   * "34", "42" зэрэг дараалал санамсаргүйгээр таарч, тест хуурамчаар унана.
   */
  expect(Object.keys(payload).sort()).toEqual([
    "hintLevel",
    "problemId",
    "startedAt",
    "status",
    "stepIndex",
    "totalSteps",
    "unaidedSteps",
    "wrongCount",
  ]);

  // Байрлалын тоонууд нь алхмын хариулттай ХОЛБООГҮЙ гэдгийг батална.
  expect(payload.problemId).toBe("p-3-002");
  expect(payload.stepIndex).toBe(0);
  expect(payload.unaidedSteps).toBe(0);
});

test("token-ийг өөрчилвөл хүчингүй болно", () => {
  const reply = startSession(problem);
  const token = encodeSession(reply.state);
  expect(decodeSession(token)).not.toBeNull();

  // Хүүхэд «би дуусгасан» гэж хуурч чадахгүй
  const [payload, sig] = token.split(".");
  const cheated = JSON.parse(Buffer.from(payload, "base64url").toString());
  cheated.status = "solved";
  const forged =
    Buffer.from(JSON.stringify(cheated)).toString("base64url") + "." + sig;

  expect(decodeSession(forged)).toBeNull();
});

test("гэмтсэн, хоосон, хэлбэр буруу token нь null буцаана (шидэхгүй)", () => {
  expect(decodeSession("")).toBeNull();
  expect(decodeSession("nodot")).toBeNull();
  expect(decodeSession("a.b")).toBeNull();
  expect(decodeSession(encodeSession(startSession(problem).state) + "x")).toBeNull();
});

test("token нь cookie-д багтах хэмжээтэй (< 1KB)", () => {
  // Яриа хуримтлагдахгүй тул хэмжээ нь бодлогын уртаас хамаарахгүй тогтмол.
  const token = encodeSession(startSession(problem).state);
  expect(token.length).toBeLessThan(1024);
});
