import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "sun" | "ghost" | "glass";

const BASE =
  "press inline-flex items-center justify-center gap-2 rounded-[18px] font-semibold " +
  "disabled:opacity-50 disabled:pointer-events-none";

/** Хүүхдийн хуруу насанд хүрэгчийнхээс том алдаа гаргадаг — 48px доош болохгүй. */
const SIZE = {
  lg: "min-h-[56px] px-6 text-[17px]",
  md: "min-h-[48px] px-5 text-[15px]",
} as const;

const VARIANT: Record<Variant, string> = {
  primary: "bg-grass text-white shadow-[0_5px_0_var(--c-grass-dk)] active:shadow-[0_2px_0_var(--c-grass-dk)]",
  sun: "bg-sun text-[#4A3200] shadow-[0_5px_0_var(--c-sun-dk)] active:shadow-[0_2px_0_var(--c-sun-dk)]",
  ghost:
    "bg-card text-ink border-2 border-line shadow-[0_4px_0_var(--c-line)] active:shadow-[0_1px_0_var(--c-line)]",
  glass:
    "bg-glass text-ink backdrop-blur-sm shadow-[0_3px_0_rgb(27_46_62/0.14)] active:shadow-none",
};

interface Common {
  variant?: Variant;
  size?: keyof typeof SIZE;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "lg",
  className = "",
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...rest}
      className={`${BASE} ${SIZE[size]} ${VARIANT[variant]} ${className}`}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "lg",
  className = "",
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return <Link {...rest} className={`${BASE} ${SIZE[size]} ${VARIANT[variant]} ${className}`} />;
}
