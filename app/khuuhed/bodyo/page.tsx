import { notFound } from "next/navigation";
import { SolveClient } from "./SolveClient";
import { PROBLEMS, getProblem, nextProblem } from "@/lib/content/problems";
import { toProblemView } from "@/lib/tutor/view";
import { beginProblem } from "./actions";

export const metadata = { title: "Хамт бодъё — Мануу" };

/**
 * Бодлогыг сервер дээр эхлүүлж, клиент рүү ЗӨВХӨН ProblemView ба TurnView явуулна.
 * Хариулт, hint, оношилгоо аль нь ч клиент рүү гарахгүй — lib/tutor/view.ts үз.
 */
export default async function Page({ searchParams }: PageProps<"/khuuhed/bodyo">) {
  const { p } = await searchParams;
  const id = typeof p === "string" ? p : PROBLEMS[0].id;
  const problem = getProblem(id);
  if (!problem) notFound();

  const started = await beginProblem(problem.id);
  if (!started.ok) notFound();

  return (
    <SolveClient
      problem={toProblemView(problem)}
      initial={started.view}
      nextId={nextProblem(problem.id)?.id ?? null}
    />
  );
}
