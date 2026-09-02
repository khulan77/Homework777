import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type {
  AnswerSpec,
  ProblemDisplay,
  SolutionStep,
} from "@/lib/tutor/types";

/**
 * Өгөгдлийн сангийн бүтэц.
 *
 * Зарчмууд:
 *  · Хүүхдийн хувийн мэдээллийг ХАМГИЙН БАГААР цуглуулна. Хаяг, сургууль,
 *    хүүхдийн зураг байхгүй. Төрсөн он/сар л байна (насанд тохирсон контентод).
 *  · `answer_spec`, `solution_steps` нь jsonb — шинэ хичээл (монгол хэл, унших)
 *    нэмэхэд schema өөрчлөгдөхгүй.
 *  · `attempt` ба `turn` салсан: тайланд attempt хангалттай, бүтэн яриаг
 *    уншихгүй. Эцэг эхийн самбар хурдан болно.
 *  · Метрикийг эхний өдрөөс хэмжинэ (`problems_solved_unaided`, `cost_micros`).
 *    Дараа нэмэх нь түүхэн өгөгдлийг алдана гэсэн үг.
 */

/* ── Enum ─────────────────────────────────────────────────── */

export const subjectCode = pgEnum("subject_code", ["math", "mn"]);
export const sessionSource = pgEnum("session_source", [
  "picked",
  "suggested",
  "photo",
]);
export const sessionStatus = pgEnum("session_status", [
  "active",
  "completed",
  "abandoned",
  "time_limit",
]);
export const attemptOutcome = pgEnum("attempt_outcome", [
  "solved",
  "taught_out",
  "skipped",
  "abandoned",
]);
export const turnRole = pgEnum("turn_role", ["manuu", "child", "system"]);
export const inputMode = pgEnum("input_mode", ["tap", "text", "voice", "ink"]);
export const verdict = pgEnum("verdict", ["correct", "near", "wrong"]);

/* ── Хэрэглэгч ────────────────────────────────────────────── */

/**
 * Эцэг эхийн бүртгэл. Хүүхэд ӨӨРӨӨ бүртгүүлэхгүй — хууль, ёс зүйн шаардлага.
 *
 * `authUserId` нь гадаад нэвтрэлтийн системийн ID (одоогоор Supabase Auth).
 * Гадаад schema руу FK татаагүй — нэвтрэлтийн provider солиход энэ багана л
 * утгаа өөрчилнө, хүснэгтийн бүтэц хэвээр үлдэнэ.
 */
export const parentAccount = pgTable(
  "parent_account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authUserId: text("auth_user_id").notNull(),
    email: text("email"),
    phone: text("phone"),
    locale: text("locale").notNull().default("mn"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("parent_auth_user_idx").on(t.authUserId)],
);

export const childProfile = pgTable(
  "child_profile",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => parentAccount.id, { onDelete: "cascade" }),
    /** Жинхэнэ нэр байх албагүй — хочид ч болно */
    displayName: text("display_name").notNull(),
    grade: smallint("grade").notNull(),
    /** Бүтэн төрсөн өдөр хэрэггүй — нас тогтооход сар/жил хангалттай */
    birthMonth: smallint("birth_month"),
    birthYear: smallint("birth_year"),
    avatarId: text("avatar_id").notNull().default("manuu"),
    aiFriendName: text("ai_friend_name").notNull().default("Мануу"),
    /** Эцэг эх тогтооно. Сервер дээр хэрэгжинэ — клиентээс тойрч болохгүй. */
    dailyMinuteLimit: integer("daily_minute_limit").notNull().default(30),
    voiceEnabled: boolean("voice_enabled").notNull().default(true),
    /**
     * Анхдагчаар ХААЛТТАЙ. Хүүхэд чөлөөтэй алдаа гаргаж чаддаг байх нь
     * сурах гол нөхцөл — бүх яриа эцэг эхэд шууд харагдвал энэ алдагдана.
     */
    transcriptVisibleToParent: boolean("transcript_visible_to_parent")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => [index("child_parent_idx").on(t.parentId)],
);

/* ── Контент (item bank) ──────────────────────────────────── */

export const subject = pgTable("subject", {
  id: text("id").primaryKey(),
  code: subjectCode("code").notNull(),
  nameMn: text("name_mn").notNull(),
  iconKey: text("icon_key"),
  isActive: boolean("is_active").notNull().default(true),
});

export const topic = pgTable(
  "topic",
  {
    id: text("id").primaryKey(),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subject.id),
    grade: smallint("grade").notNull(),
    nameMn: text("name_mn").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    /** Урьдчилан эзэмшсэн байх сэдэв */
    requiresTopicId: text("requires_topic_id"),
  },
  (t) => [index("topic_subject_grade_idx").on(t.subjectId, t.grade)],
);

/**
 * Бодлого — "үнэний давхарга".
 *
 * `answerSpec` ба `solutionSteps` нь ЗӨВ ХАРИУ, hint, оношилгоог агуулна.
 * Эдгээр багана хэзээ ч клиент рүү бүтнээрээ гарахгүй — lib/tutor/view.ts үз.
 */
export const problem = pgTable(
  "problem",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id")
      .notNull()
      .references(() => topic.id),
    grade: smallint("grade").notNull(),
    promptMn: text("prompt_mn").notNull(),
    display: jsonb("display").$type<ProblemDisplay>().notNull(),
    answerSpec: jsonb("answer_spec").$type<AnswerSpec>().notNull(),
    solutionSteps: jsonb("solution_steps").$type<SolutionStep[]>().notNull(),
    difficulty: smallint("difficulty").notNull().default(1),
    /** LLM-ээр үүсгэсэн контентыг багш шалгасан эсэх — чанарын хамгаалалт */
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
  },
  (t) => [index("problem_topic_idx").on(t.topicId, t.grade, t.difficulty)],
);

/* ── Session ба явц ───────────────────────────────────────── */

export const session = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    childId: uuid("child_id")
      .notNull()
      .references(() => childProfile.id, { onDelete: "cascade" }),
    subjectId: text("subject_id").references(() => subject.id),
    topicId: text("topic_id").references(() => topic.id),
    source: sessionSource("source").notNull().default("picked"),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    status: sessionStatus("status").notNull().default("active"),
    totalMs: integer("total_ms").notNull().default(0),
    problemsAttempted: integer("problems_attempted").notNull().default(0),
    /** NORTH STAR: тусламжгүй өөрөө бодсон бодлогын тоо */
    problemsSolvedUnaided: integer("problems_solved_unaided")
      .notNull()
      .default(0),
    /** Unit economics-ыг эхний өдрөөс хэмжинэ. Дараа нэмэх нь түүхийг алдана. */
    costMicros: integer("cost_micros").notNull().default(0),
  },
  (t) => [index("session_child_started_idx").on(t.childId, t.startedAt.desc())],
);

export const attempt = pgTable(
  "attempt",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => session.id, { onDelete: "cascade" }),
    problemId: text("problem_id")
      .notNull()
      .references(() => problem.id),
    orderIndex: integer("order_index").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    outcome: attemptOutcome("outcome"),
    /** 0 = огт тусламж аваагүй */
    hintLevelUsed: smallint("hint_level_used").notNull().default(0),
    wrongAnswerCount: integer("wrong_answer_count").notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(0),
  },
  (t) => [index("attempt_session_idx").on(t.sessionId, t.orderIndex)],
);

/** Бүтэн яриа. Тайлан гаргахад энэ хүснэгтийг УНШИХГҮЙ — attempt хангалттай. */
export const turn = pgTable(
  "turn",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => attempt.id, { onDelete: "cascade" }),
    role: turnRole("role").notNull(),
    stepIndex: smallint("step_index").notNull(),
    contentMn: text("content_mn").notNull(),
    mode: inputMode("mode"),
    verdict: verdict("verdict"),
    latencyMs: integer("latency_ms"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("turn_attempt_idx").on(t.attemptId, t.createdAt)],
);

/* ── Эзэмшилт ба өдрийн хязгаар ───────────────────────────── */

/**
 * Сэдэв тус бүрийн эзэмшилт. Зориудаар denormalized — эцэг эхийн самбар
 * "юуг сайн, юуг сул" гэдгийг НЭГ query-ээр гаргана.
 */
export const topicMastery = pgTable(
  "topic_mastery",
  {
    childId: uuid("child_id")
      .notNull()
      .references(() => childProfile.id, { onDelete: "cascade" }),
    topicId: text("topic_id")
      .notNull()
      .references(() => topic.id),
    /** 0–100 */
    level: smallint("level").notNull().default(0),
    /** Тусламжгүй бодсон хувь, 0–100 */
    unaidedRate: smallint("unaided_rate").notNull().default(0),
    attemptsCount: integer("attempts_count").notNull().default(0),
    lastPracticedAt: timestamp("last_practiced_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.childId, t.topicId] })],
);

/**
 * Өдрийн идэвх. Дэлгэцийн цагийн хязгаарыг ЭНДЭЭС шалгана — сервер дээр,
 * клиент дээр биш. Эцэг эхийн итгэлийг олох хамгийн хямд арга.
 */
export const dailyActivity = pgTable(
  "daily_activity",
  {
    childId: uuid("child_id")
      .notNull()
      .references(() => childProfile.id, { onDelete: "cascade" }),
    /** Хүүхдийн орон нутгийн өдөр (Asia/Ulaanbaatar) */
    day: date("day", { mode: "string" }).notNull(),
    minutesUsed: integer("minutes_used").notNull().default(0),
    sessionsCount: integer("sessions_count").notNull().default(0),
    problemsSolved: integer("problems_solved").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.childId, t.day] })],
);

/* ── Төрлүүд ──────────────────────────────────────────────── */

export type ParentAccountRow = typeof parentAccount.$inferSelect;
export type ChildProfileRow = typeof childProfile.$inferSelect;
export type ProblemRow = typeof problem.$inferSelect;
export type SessionRow = typeof session.$inferSelect;
export type AttemptRow = typeof attempt.$inferSelect;
export type TurnRow = typeof turn.$inferSelect;
