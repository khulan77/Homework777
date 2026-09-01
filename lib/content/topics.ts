import type { Topic } from "@/lib/tutor/types";

export const TOPICS: Topic[] = [
  {
    id: "math-3-aravt-nemeh",
    subject: "math",
    grade: 3,
    nameMn: "Аравтаар нэмэх, хасах",
  },
  {
    id: "math-3-hooson-nud",
    subject: "math",
    grade: 3,
    nameMn: "Хоосон нүд олох",
    requires: "math-3-aravt-nemeh",
  },
];

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}
