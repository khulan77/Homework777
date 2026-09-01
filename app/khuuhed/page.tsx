import Link from "next/link";
import { Steppe, Khee } from "@/components/scene/Steppe";
import { Greeting, WeekDots } from "./HomeClient";
import { NumberViz } from "@/components/shagai/Shagai";
import { PROBLEMS } from "@/lib/content/problems";

export const metadata = { title: "Мануу" };

/**
 * Хүүхдийн нүүр. 5 секундэд "одоо юу хийх вэ" гэдгийг шийдүүлэх ёстой.
 * Тиймээс НЭГ л том ногоон товч байна — бусад нь түүнээс жижиг.
 */
export default function Page() {
  const next = PROBLEMS[0];

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-gradient-to-b from-sky-hi to-sky-lo">
      <Steppe />
      <Khee className="absolute inset-x-0 top-0 z-[2]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 pb-4 pt-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <WeekDots done={[true, true, false, true, false, false, false]} />
          <div className="flex gap-2">
            <Link
              href="/khuuhed"
              aria-label="Найзаа сонгох"
              className="press grid h-11 w-11 place-items-center rounded-full bg-glass text-lg shadow-[0_3px_0_rgb(27_46_62/0.12)] backdrop-blur-sm"
            >
              🐱
            </Link>
            <Link
              href="/"
              aria-label="Эцэг эхийн хэсэг"
              className="press grid h-11 w-11 place-items-center rounded-full bg-glass text-lg shadow-[0_3px_0_rgb(27_46_62/0.12)] backdrop-blur-sm"
            >
              👤
            </Link>
          </div>
        </header>

        <Greeting childName="Хулан" lastTopic="хасах" />

        <div className="grid max-w-2xl gap-3">
          {/* Гол товч — хүүхдийн 80% үүнийг дарна. Сонгох ачааллыг тэглэнэ. */}
          <Link
            href={`/khuuhed/bodyo?p=${next.id}`}
            className="press grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[22px] bg-gradient-to-br from-grass to-grass-dk px-5 py-4 text-white shadow-[0_6px_0_rgb(23_80_62/0.45)] active:shadow-[0_2px_0_rgb(23_80_62/0.45)]"
          >
            <span className="grid h-13 w-13 place-items-center rounded-full bg-white/20 p-3 text-xl">▶</span>
            <span>
              <span className="block font-display text-xl font-bold">Үргэлжлүүлэх</span>
              <span className="block text-sm opacity-90">Математик · Хоосон нүд олох</span>
              <span className="mt-1.5 flex gap-1.5">
                <i className="block h-1.5 w-6 rounded-full bg-white" />
                <i className="block h-1.5 w-6 rounded-full bg-white" />
                <i className="block h-1.5 w-6 rounded-full bg-white/30" />
                <i className="block h-1.5 w-6 rounded-full bg-white/30" />
              </span>
            </span>
            <span className="text-2xl opacity-85">→</span>
          </Link>

          {/* Зөвхөн 2 хичээл. Гурав, дөрөв болвол 7 настай хүүхэд эргэлзэнэ. */}
          <div className="grid gap-3 sm:grid-cols-2">
            <SubjectCard
              href={`/khuuhed/bodyo?p=${next.id}`}
              name="Математик"
              note="2 сэдэв · хоосон нүд"
              ribbon="ҮРГЭЛЖЛҮҮЛЭХ"
              art={<div className="scale-90"><NumberViz value={10} interactive={false} /></div>}
            />
            <SubjectCard
              href="/khuuhed"
              name="Монгол хэл"
              note="Удахгүй · үг нөхөх"
              art={<span className="text-4xl">📖</span>}
            />
          </div>

          <Link
            href="/khuuhed"
            className="press flex items-center gap-3 rounded-[20px] border-[3px] border-dashed border-white/85 bg-white/40 px-4 py-3.5 backdrop-blur-sm"
          >
            <span className="text-2xl">📷</span>
            <span>
              <span className="block font-semibold text-ink">Дэвтрийнхээ зургийг оруулах</span>
              <span className="block text-sm text-ink-2">Гэрийн даалгавраа зурагдаж өгөөрэй</span>
            </span>
          </Link>
        </div>

        <nav className="mt-auto flex justify-center gap-1.5 pt-3">
          <NavItem href="/khuuhed" icon="🏠" label="Нүүр" current />
          <NavItem href="/khuuhed" icon="📚" label="Миний даалгавар" />
          <NavItem href="/khuuhed" icon="🎁" label="Цуглуулга" />
        </nav>
      </div>
    </div>
  );
}

function SubjectCard({
  href,
  name,
  note,
  art,
  ribbon,
}: {
  href: string;
  name: string;
  note: string;
  art: React.ReactNode;
  ribbon?: string;
}) {
  return (
    <Link
      href={href}
      className="press relative grid grid-cols-[auto_1fr] items-center gap-3.5 overflow-hidden rounded-[22px] border-[3px] border-felt-sh bg-felt px-4 py-3.5 shadow-[0_5px_0_rgb(27_46_62/0.16)] active:shadow-[0_2px_0_rgb(27_46_62/0.16)]"
    >
      {ribbon && (
        <span className="absolute right-0 top-0 rounded-bl-[10px] bg-sun px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide text-[#4A3200]">
          {ribbon}
        </span>
      )}
      <span className="grid h-16 w-16 place-items-center">{art}</span>
      <span>
        <span className="block font-display text-lg font-bold text-[#1B2E3E]">{name}</span>
        <span className="block text-[13px] text-[#5B6F7E]">{note}</span>
      </span>
    </Link>
  );
}

function NavItem({
  href,
  icon,
  label,
  current,
}: {
  href: string;
  icon: string;
  label: string;
  current?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`press grid min-w-[88px] justify-items-center gap-0.5 rounded-[18px] px-4 py-2 text-[11.5px] font-semibold backdrop-blur-sm ${
        current
          ? "bg-blue text-white shadow-[0_3px_0_var(--c-blue-dk)]"
          : "bg-glass text-ink-2 shadow-[0_3px_0_rgb(27_46_62/0.12)]"
      }`}
    >
      <span className="text-xl leading-none">{icon}</span>
      {label}
    </Link>
  );
}
