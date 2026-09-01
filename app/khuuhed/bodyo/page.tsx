import { notFound } from "next/navigation";
import { SolveClient } from "./SolveClient";
import { PROBLEMS, getProblem, nextProblem } from "@/lib/content/problems";

export const metadata = { title: "Хамт бодъё — Мануу" };

/**
 * Бодлогыг сервер дээр сонгож, зөвхөн шаардлагатайг нь клиент рүү дамжуулна.
 * Хариултын түлхүүр клиент дээр байгаа нь MVP-ийн буулт — engine-ийг сервер рүү
 * зөөх үед (Server Action) энэ автоматаар шийдэгдэнэ.
 */
export default async function Page({ searchParams }: PageProps<"/khuuhed/bodyo">) {
  const { p } = await searchParams;
  const id = typeof p === "string" ? p : PROBLEMS[0].id;
  const problem = getProblem(id);
  if (!problem) notFound();

  return (
    <SolveClient problem={problem} nextId={nextProblem(problem.id)?.id ?? null} />
  );
}
