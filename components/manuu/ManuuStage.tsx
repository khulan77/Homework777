"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { Manuu, type ManuuSize } from "./Manuu";
import type { CostumeId } from "./costumes";
import type { Mood } from "@/lib/tutor/types";

const Manuu3D = dynamic(() => import("./Manuu3D"), {
  ssr: false,
  loading: () => null,
});

const BOX: Record<ManuuSize, string> = {
  sm: "w-16 h-20",
  md: "w-28 h-36",
  lg: "w-44 h-56 sm:w-52 sm:h-64",
};

/**
 * Мануугийн тайз — 2D ба 3D-г нэг интерфэйсийн ард нэгтгэнэ.
 *
 * Дүрэм: 2D SVG ШУУД гарна (0 KB нэмэлт), 3D нь араас ачаалагдаад солигдоно.
 * Ингэснээр сүлжээ сул үед ч хүүхэд хоосон дэлгэц хардаггүй.
 *
 * 3D-г ЗОРИУДААР алгасах тохиолдлууд:
 *  · Хэрэглэгч «өгөгдөл хэмнэх» горимд байвал (Монголд утасны багц үнэтэй)
 *  · Төхөөрөмжийн санах ой 2GB-аас бага (хуучин Android)
 *  · Хөдөлгөөн багасгах тохиргоо асаалттай
 * Эдгээр тохиолдолд 2D хувилбар бүрэн ажиллана — функц алдагдахгүй.
 */
/**
 * Төхөөрөмж 3D-г дааж байгаа эсэх. Нэг л удаа тооцоолж хадгална — эс бөгөөс
 * useSyncExternalStore төгсгөлгүй давтана.
 */
const NEVER = () => () => {};
const serverFalse = () => false;
let capable: boolean | null = null;

function canRender3D(): boolean {
  if (capable !== null) return capable;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  const saveData = nav.connection?.saveData === true;
  const lowMemory = (nav.deviceMemory ?? 8) < 2;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  capable = !saveData && !lowMemory && !reduce;
  return capable;
}

export function ManuuStage({
  mood = "idle",
  costume = "none",
  size = "md",
  talking = false,
  waving = false,
  onTap,
  className = "",
}: {
  mood?: Mood;
  costume?: CostumeId;
  size?: ManuuSize;
  talking?: boolean;
  waving?: boolean;
  onTap?: () => void;
  className?: string;
}) {
  const use3D = useSyncExternalStore(NEVER, canRender3D, serverFalse);

  return (
    <div
      className={`relative ${BOX[size]} ${onTap ? "cursor-pointer" : ""} ${className}`}
      onClick={onTap}
    >
      {/* 3D ирэх хүртэл (эсвэл огт ирэхгүй бол) энэ л харагдана */}
      <Manuu
        mood={mood}
        size={size}
        talking={talking}
        waving={waving}
        className={`absolute inset-0 m-auto transition-opacity duration-500 ${
          use3D ? "opacity-0" : "opacity-100"
        }`}
      />
      {use3D && (
        <Manuu3D
          mood={mood}
          costume={costume}
          talking={talking}
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
