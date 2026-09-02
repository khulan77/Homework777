/**
 * Item bank-ийг өгөгдлийн сан руу.  Ажиллуулах:  bun run db:seed
 *
 * Контент нь кодод (lib/content/) үлдэж, DB нь түүний ТУСГАЛ болно.
 * Яагаад ингэсэн бэ:
 *  · Бодлого, hint-ийг git-ээр хянана — багшийн засварыг PR-аар үзнэ.
 *  · Тест нь DB-гүйгээр ажиллана.
 *  · Дараа нь контент админ гарах үед энэ урсгал эргэнэ (DB → эх сурвалж).
 *
 * Дахин ажиллуулж болно (idempotent) — байгаа мөрийг шинэчилнэ.
 */
import { db } from "./index";
import { problem, subject, topic } from "./schema";
import { PROBLEMS } from "@/lib/content/problems";
import { TOPICS } from "@/lib/content/topics";

const SUBJECTS = [
  { id: "math", code: "math" as const, nameMn: "Математик", iconKey: "shagai" },
  { id: "mn", code: "mn" as const, nameMn: "Монгол хэл", iconKey: "book" },
];

async function main() {
  const d = db();

  console.log("→ Хичээлүүд…");
  for (const s of SUBJECTS) {
    await d
      .insert(subject)
      .values(s)
      .onConflictDoUpdate({
        target: subject.id,
        set: { nameMn: s.nameMn, iconKey: s.iconKey },
      });
  }

  console.log("→ Сэдвүүд…");
  for (const [i, t] of TOPICS.entries()) {
    await d
      .insert(topic)
      .values({
        id: t.id,
        subjectId: t.subject,
        grade: t.grade,
        nameMn: t.nameMn,
        orderIndex: i,
        requiresTopicId: t.requires ?? null,
      })
      .onConflictDoUpdate({
        target: topic.id,
        set: { nameMn: t.nameMn, orderIndex: i, requiresTopicId: t.requires ?? null },
      });
  }

  console.log("→ Бодлогууд…");
  for (const p of PROBLEMS) {
    await d
      .insert(problem)
      .values({
        id: p.id,
        topicId: p.topicId,
        grade: p.grade,
        promptMn: p.promptMn,
        display: p.display,
        answerSpec: p.answer,
        solutionSteps: p.steps,
        difficulty: p.difficulty,
      })
      .onConflictDoUpdate({
        target: problem.id,
        set: {
          promptMn: p.promptMn,
          display: p.display,
          answerSpec: p.answer,
          solutionSteps: p.steps,
          difficulty: p.difficulty,
        },
      });
  }

  console.log(
    `✓ ${SUBJECTS.length} хичээл, ${TOPICS.length} сэдэв, ${PROBLEMS.length} бодлого`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Seed амжилтгүй:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
