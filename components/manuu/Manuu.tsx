"use client";

import { useEffect, useRef } from "react";
import type { Mood } from "@/lib/tutor/types";

export type ManuuSize = "sm" | "md" | "lg";

const SIZE: Record<ManuuSize, string> = {
  sm: "w-16",
  md: "w-28",
  lg: "w-44 sm:w-52",
};

interface Props {
  mood?: Mood;
  size?: ManuuSize;
  /** Ярьж байгаа эсэх — ам хөдөлнө */
  talking?: boolean;
  /** Даллах (нүүр хуудсанд угтахад) */
  waving?: boolean;
  onTap?: () => void;
  className?: string;
}

/**
 * Мануу — мануул (Pallas's cat) хэлбэртэй AI найз.
 * Робот биш, Монголын өөрийн амьтан. Хүүхэд эхний хормоос "манайх" гэж мэдэрнэ.
 *
 * Анивчих, үсрэх, толгой хазайх бүгд CSS-ээр — React state байхгүй тул
 * дахин render хийхгүй, санамсаргүй cascade үүсэхгүй.
 * Зөвхөн нүдээр дагах нь JS шаардана (DOM-ыг шууд өөрчилнө, state биш).
 */
export function Manuu({
  mood = "idle",
  size = "md",
  talking = false,
  waving = false,
  onTap,
  className = "",
}: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const svg = ref.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      if (!r.width) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.44;
      const dx = clamp((e.clientX - cx) / (r.width * 2.2));
      const dy = clamp((e.clientY - cy) / (r.height * 2.2));
      svg.querySelectorAll<SVGElement>(".mn-eye").forEach((el) => {
        el.style.transform = `translate(${dx * 5.5}px, ${dy * 4}px)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 240"
      role="img"
      aria-label="Мануу — чиний найз"
      onClick={onTap}
      className={`${SIZE[size]} block overflow-visible ${onTap ? "cursor-pointer" : ""} ${className}`}
      data-mood={mood}
      data-talking={talking || undefined}
    >
      <ellipse cx="100" cy="232" rx="54" ry="8" fill="rgb(27 46 62 / 0.13)" />

      <g className="mn-hop">
        <g className="mn-root">
          {/* бие + дээл */}
          <ellipse fill="#CDAE87" cx="100" cy="196" rx="47" ry="34" />
          <ellipse fill="#F0DFC6" cx="100" cy="203" rx="30" ry="24" />
          <path d="M60 182 q40 -14 80 0 l-4 14 q-36 -12 -72 0z" fill="#2E7DBF" opacity="0.92" />

          {waving && (
            <g className="mn-arm">
              <ellipse
                fill="#CDAE87"
                cx="152"
                cy="176"
                rx="12"
                ry="19"
                transform="rotate(-22 152 176)"
              />
            </g>
          )}

          <g className="mn-head">
            {/* чих — хажуу тийш салсан, мануулын онцлог */}
            <g className="mn-ear mn-ear-l">
              <ellipse fill="#CDAE87" cx="43" cy="112" rx="17" ry="14" />
              <ellipse fill="#B9705F" opacity="0.5" cx="45" cy="112" rx="8" ry="6" />
            </g>
            <g className="mn-ear mn-ear-r">
              <ellipse fill="#CDAE87" cx="157" cy="112" rx="17" ry="14" />
              <ellipse fill="#B9705F" opacity="0.5" cx="155" cy="112" rx="8" ry="6" />
            </g>

            <path
              fill="#CDAE87"
              d="M100 47c40 0 71 26 71 60s-31 63-71 63-71-29-71-63 31-60 71-60z"
            />
            <ellipse fill="#F0DFC6" cx="100" cy="115" rx="58" ry="52" />

            <rect fill="#6E5943" opacity="0.7" x="82" y="70" width="5" height="15" rx="2.5" />
            <rect fill="#6E5943" opacity="0.7" x="97" y="66" width="5" height="17" rx="2.5" />
            <rect fill="#6E5943" opacity="0.7" x="112" y="70" width="5" height="15" rx="2.5" />

            {/* нээлттэй нүд */}
            <g className="mn-eyes-open">
              <circle cx="76" cy="112" r="19" fill="#FFFDF7" />
              <circle cx="124" cy="112" r="19" fill="#FFFDF7" />
              <circle cx="76" cy="112" r="14" fill="#F2A93B" />
              <circle cx="124" cy="112" r="14" fill="#F2A93B" />
              <circle className="mn-eye" cx="76" cy="112" r="7.5" fill="#2A2118" />
              <circle className="mn-eye" cx="124" cy="112" r="7.5" fill="#2A2118" />
              <circle className="mn-eye" cx="80" cy="107" r="3.4" fill="#fff" />
              <circle className="mn-eye" cx="128" cy="107" r="3.4" fill="#fff" />
            </g>
            {/* анивчсан */}
            <g className="mn-eyes-shut" stroke="#6E5943" strokeWidth="4.5" fill="none" strokeLinecap="round">
              <path d="M62 113q14 8 28 0" />
              <path d="M110 113q14 8 28 0" />
            </g>
            {/* баярласан ^ ^ */}
            <g className="mn-eyes-joy" stroke="#6E5943" strokeWidth="4.5" fill="none" strokeLinecap="round">
              <path d="M62 116q14-13 28 0" />
              <path d="M110 116q14-13 28 0" />
            </g>

            <path fill="#B9705F" d="M100 133c5 0 8 2.5 8 5s-4 5.5-8 5.5-8-3-8-5.5 3-5 8-5z" />
            <ellipse className="mn-mouth" cx="100" cy="151" rx="6" ry="3" fill="#8A5A48" />
            <path
              d="M44 128q9 3 15 1M43 140q9 3 15 1M156 128q-9 3-15 1M157 140q-9 3-15 1"
              stroke="#6E5943"
              strokeWidth="3"
              opacity="0.55"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>
      </g>

      <style>{`
        .mn-root{transform-origin:100px 196px;animation:mn-breathe 3.8s ease-in-out infinite}
        @keyframes mn-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.028)}}

        .mn-head{transform-origin:100px 118px;transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
        [data-mood="think"] .mn-head{transform:rotate(-8deg)}
        [data-mood="curious"] .mn-head{transform:rotate(7deg)}
        [data-mood="calm"] .mn-head{transform:rotate(-5deg)}

        .mn-ear{transform-origin:100px 90px;transition:transform .35s}
        [data-mood="curious"] .mn-ear-l{transform:rotate(-11deg)}
        [data-mood="curious"] .mn-ear-r{transform:rotate(11deg)}

        .mn-eye{transition:transform .18s ease-out}

        /* Анивчих — CSS-ээр. React state хэрэггүй. */
        .mn-eyes-open{animation:mn-blink 6.2s infinite}
        .mn-eyes-shut{opacity:0;animation:mn-blink-inv 6.2s infinite}
        .mn-eyes-joy{opacity:0}
        @keyframes mn-blink{0%,95.5%,100%{opacity:1}97.2%{opacity:0}}
        @keyframes mn-blink-inv{0%,95.5%,100%{opacity:0}97.2%{opacity:1}}

        [data-mood="joy"] .mn-eyes-open,
        [data-mood="joy"] .mn-eyes-shut{opacity:0;animation:none}
        [data-mood="joy"] .mn-eyes-joy{opacity:1}
        [data-mood="joy"] .mn-hop{animation:mn-hop .62s cubic-bezier(.28,1.6,.5,1)}
        @keyframes mn-hop{0%,100%{transform:translateY(0)}38%{transform:translateY(-18px)}}

        .mn-arm{transform-origin:150px 162px;animation:mn-wave 2.6s ease-in-out infinite}
        @keyframes mn-wave{0%,72%,100%{transform:rotate(0)}80%{transform:rotate(-26deg)}90%{transform:rotate(-6deg)}}

        .mn-mouth{transform-origin:100px 151px}
        [data-talking] .mn-mouth{animation:mn-yap .28s ease-in-out infinite}
        @keyframes mn-yap{0%,100%{transform:scaleY(.5)}50%{transform:scaleY(1.5)}}
      `}</style>
    </svg>
  );
}

function clamp(n: number) {
  return Math.max(-1, Math.min(1, n));
}
