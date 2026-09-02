/**
 * Мануугийн заах системийн төрлүүд.
 *
 * ГОЛ ЗАРЧИМ: "үнэн" ба "яриа" салсан байна.
 *   · Зөв хариуг ЗӨВХӨН энэ файл дахь өгөгдөл тодорхойлно (deterministic).
 *   · LLM хэзээ ч зөв/буруу гэж шийдэхгүй — зөвхөн ЯАЖ тайлбарлахыг хариуцна.
 * Ингэснээр AI хий үзэгдэл харсан ч буруу хариуг зөв гэж хэлэх боломжгүй.
 */

export type Grade = 1 | 2 | 3 | 4 | 5;

export type SubjectCode = "math" | "mn";

/** Хариултыг машинаар шалгах тодорхойлолт. */
export type AnswerSpec =
  | { kind: "number"; value: number }
  | { kind: "text"; accept: string[] }
  | { kind: "sequence"; values: number[] };

/**
 * Хүүхдийн түгээмэл алдаа, тус бүрд нь тодорхой хариу үг.
 * LLM таамаглахгүй — багш урьдчилан бичнэ.
 */
export interface NearMiss {
  /** Хүүхдийн өгсөн буруу утга */
  value: number | string;
  /** Мануу яг юу хэлэх вэ. Загнахгүй, оношилно. */
  reply: string;
}

/** Нэг бодлогыг задалсан нэг алхам. Нэг алхам = нэг асуулт. */
export interface SolutionStep {
  /** Мануугийн асуулт */
  ask: string;
  /** Энэ алхмын зөв хариулт */
  expect: AnswerSpec;
  /** Товшиж сонгох хувилбарууд — гар ашиглалтыг багасгана */
  options?: (number | string)[];
  /** Түгээмэл алдаанд өгөх тусгай хариу */
  nearMisses?: NearMiss[];
  /** Тусламжийн шат: 1 → чиглүүлэх, 2 → тодорхой заавар */
  hints: [string, string];
  /** 3 удаа буруудсаны дараа Мануу өөрөө тайлбарлана (гацаанаас гаргана) */
  teachOut: string;
  /** Зөв хариулахад */
  celebrate: string;
}

/** Дэлгэц дээр бодлогыг хэрхэн харуулах вэ */
export interface ProblemDisplay {
  left: number | null;
  op: "+" | "-";
  right: number | null;
  result: number | null;
  /** Аль нүд хоосон вэ */
  blank: "left" | "right" | "result";
}

export interface Problem {
  id: string;
  subject: SubjectCode;
  topicId: string;
  grade: Grade;
  /** Хүнд уншуулах текст, ж: "□ + 18 = 42" */
  promptMn: string;
  display: ProblemDisplay;
  /** Бодлогын эцсийн хариу */
  answer: AnswerSpec;
  steps: SolutionStep[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface Topic {
  id: string;
  subject: SubjectCode;
  grade: Grade;
  nameMn: string;
  /** Урьдчилан эзэмшсэн байх сэдэв */
  requires?: string;
}

/* ── Session-ий төлөв ─────────────────────────────────────── */

export type TurnRole = "manuu" | "child";
export type InputMode = "tap" | "text" | "voice" | "ink";

export interface Turn {
  role: TurnRole;
  text: string;
  stepIndex: number;
  mode?: InputMode;
  verdict?: Verdict;
  at: number;
}

export type Verdict = "correct" | "near" | "wrong";

/** Мануугийн сэтгэл хөдлөл — UI үүнийг л уншина */
export type Mood = "idle" | "think" | "curious" | "joy" | "calm";

export type SessionStatus = "active" | "solved" | "taughtOut" | "abandoned";

/**
 * Session-ий төлөв.
 *
 * Зориудаар ЖИЖИГ бөгөөд хязгаартай: гарын үсэгтэй token болж клиент, сервер
 * хооронд явна. Яриа (`Turn[]`) энд ХУРИМТЛАГДАХГҮЙ — хязгааргүй өсөх байсан.
 * Харин дуудлага бүр өөрийн үүсгэсэн turn-ээ `TutorReply.newTurns`-ээр буцаана,
 * тэдгээрийг Phase 4-т өгөгдлийн сан руу бичнэ.
 */
export interface SessionState {
  problemId: string;
  stepIndex: number;
  /** Энэ алхам дээр хэдэн удаа буруудсан */
  wrongCount: number;
  /** 0 = тусламж аваагүй */
  hintLevel: 0 | 1 | 2 | 3;
  /** Бүх бодлогын турш тусламж авалгүй бодсон алхмын тоо (north star метрик) */
  unaidedSteps: number;
  totalSteps: number;
  status: SessionStatus;
  startedAt: number;
}

/** Engine-ээс UI рүү буцах нэг үр дүн */
export interface TutorReply {
  state: SessionState;
  /** Энэ дуудлагад үүссэн яриа — DB руу бичих зориулалттай, UI-д заавал биш */
  newTurns: Turn[];
  /** Мануугийн хэлэх үг */
  say: string;
  mood: Mood;
  verdict: Verdict | null;
  /** Дараагийн алхмын товшилтын сонголтууд */
  options: (number | string)[] | null;
  /** Бодлого бүхэлдээ дууссан эсэх */
  finished: boolean;
  /** Хайрцагт бичих утга (зөв хариулсны дараа) */
  fillSlot: string | null;
}
