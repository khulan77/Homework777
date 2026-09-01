/**
 * Тал нутаг — бүтээгдэхүүний ертөнц.
 *
 * Гэр, овоо хадагтай, морь, хонь, алсын уул. Minecraft-ийн ертөнцийг
 * зээлэхгүй, өөрийнхөө ертөнцийг барина. Server Component —
 * зөвхөн зураг, JS шаардахгүй.
 */
export function Steppe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 720"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <pattern id="alkhan" width="30" height="16" patternUnits="userSpaceOnUse">
          {/* алхан хээ */}
          <path
            d="M2 13V5h8v5h5V3h8v10"
            fill="none"
            stroke="var(--c-blue)"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </pattern>
      </defs>

      <path
        d="M0 330 L130 240 L226 296 L340 212 L452 306 L546 260 L668 330 L790 248 L900 312 L1000 256 L1000 430 L0 430Z"
        fill="var(--c-hill-far)"
        opacity="0.5"
      />
      <path d="M0 388 Q190 328 396 382 T790 366 T1000 390 L1000 720 L0 720Z" fill="var(--c-hill-far)" />
      <path d="M0 446 Q250 388 508 440 T1000 448 L1000 720 L0 720Z" fill="var(--c-hill-mid)" />
      <path d="M0 530 Q310 484 620 530 T1000 524 L1000 720 L0 720Z" fill="var(--c-hill-near)" />
      <rect y="662" width="1000" height="58" fill="var(--c-earth)" />
      <rect y="662" width="1000" height="7" fill="var(--c-hill-near)" />

      <circle cx="892" cy="86" r="36" fill="var(--c-sun)" opacity="0.9" />
      <circle cx="892" cy="86" r="50" fill="var(--c-sun)" opacity="0.16" />

      <g className="st-cloud-a" opacity="0.92" fill="#fff">
        <ellipse cx="140" cy="104" rx="48" ry="26" />
        <ellipse cx="184" cy="112" rx="36" ry="20" />
        <ellipse cx="100" cy="114" rx="32" ry="18" />
      </g>
      <g className="st-cloud-b" opacity="0.78" fill="#fff">
        <ellipse cx="590" cy="152" rx="52" ry="27" />
        <ellipse cx="640" cy="160" rx="38" ry="20" />
        <ellipse cx="546" cy="162" rx="34" ry="18" />
      </g>

      {/* овоо */}
      <g>
        <path d="M84 586 L92 522 M100 586 L92 522" stroke="var(--c-wood-dk)" strokeWidth="5" strokeLinecap="round" />
        <path d="M92 530 q26 6 40 22" stroke="var(--c-khadag)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
        <path d="M92 540 q-24 8 -34 24" stroke="var(--c-khadag)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
        <g fill="#9AA6A0">
          <ellipse cx="92" cy="590" rx="44" ry="16" />
          <ellipse cx="74" cy="576" rx="20" ry="12" />
          <ellipse cx="110" cy="576" rx="20" ry="12" />
          <ellipse cx="92" cy="564" rx="19" ry="11" />
        </g>
      </g>

      {/* гэр */}
      <g>
        <circle className="st-puff" cx="838" cy="440" r="9" fill="#fff" opacity="0.5" />
        <circle className="st-puff st-puff-2" cx="842" cy="440" r="7" fill="#fff" opacity="0.5" />
        <circle className="st-puff st-puff-3" cx="834" cy="440" r="8" fill="#fff" opacity="0.5" />
        <path d="M752 482 Q838 420 924 482 Z" fill="var(--c-felt)" stroke="var(--c-felt-sh)" strokeWidth="2" />
        <path
          d="M838 428 L784 480 M838 428 L812 481 M838 428 L866 481 M838 428 L894 480"
          stroke="var(--c-felt-sh)"
          strokeWidth="2.5"
          opacity="0.8"
        />
        <ellipse cx="838" cy="430" rx="15" ry="6" fill="var(--c-wood)" />
        <rect x="758" y="480" width="160" height="80" rx="8" fill="var(--c-felt)" stroke="var(--c-felt-sh)" strokeWidth="2" />
        <rect x="758" y="546" width="160" height="7" fill="var(--c-felt-sh)" opacity="0.7" />
        <rect x="816" y="506" width="44" height="54" rx="5" fill="var(--c-door)" />
        <path d="M822 514 h32 M822 522 h32" stroke="#F0C28C" strokeWidth="2.5" opacity="0.8" />
        <circle cx="851" cy="534" r="3" fill="#F0C28C" />
      </g>

      {/* хонь */}
      <g className="st-sheep">
        <ellipse cx="330" cy="622" rx="26" ry="19" fill="#FBFAF6" />
        <circle cx="318" cy="610" r="9" fill="#FBFAF6" />
        <circle cx="340" cy="608" r="10" fill="#FBFAF6" />
        <ellipse cx="352" cy="614" rx="10" ry="8" fill="#4A4238" />
        <circle cx="356" cy="612" r="1.8" fill="#fff" />
        <path d="M318 638v9M338 638v9" stroke="#4A4238" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g className="st-sheep st-sheep-2">
        <ellipse cx="404" cy="636" rx="20" ry="15" fill="#FBFAF6" />
        <circle cx="395" cy="627" r="7" fill="#FBFAF6" />
        <ellipse cx="420" cy="630" rx="8" ry="6.5" fill="#4A4238" />
        <circle cx="423" cy="628" r="1.5" fill="#fff" />
        <path d="M396 648v7M412 648v7" stroke="#4A4238" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* морь */}
      <g className="st-horse">
        <ellipse cx="612" cy="600" rx="50" ry="29" fill="#6B4A32" />
        <path d="M648 583 q16-29 25-37 q10-8 14 2 q4 10-6 18 l-15 21z" fill="#6B4A32" />
        <path d="M669 548 l6-13 l6 13z" fill="#6B4A32" />
        <path d="M656 557 q13-13 21-8 q-6 12-15 18z" fill="#33241A" />
        <circle cx="671" cy="557" r="3" fill="#1A120C" />
        <path d="M562 598 q-21 6 -25 25 q13-6 25-13z" fill="#33241A" />
        <path d="M580 597v30M600 599v28M628 597v30M648 595v32" stroke="#6B4A32" strokeWidth="10" strokeLinecap="round" />
        <path d="M580 619v8M600 619v8M628 619v8M648 619v8" stroke="#FBFAF6" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="624" cy="589" rx="14" ry="10" fill="#FBFAF6" opacity="0.85" />
      </g>

      <style>{`
        @keyframes st-drift{from{transform:translateX(0)}to{transform:translateX(110px)}}
        @keyframes st-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes st-smoke{0%{opacity:.5;transform:translateY(0) scale(.7)}100%{opacity:0;transform:translateY(-46px) scale(1.5)}}
        @keyframes st-graze{0%,100%{transform:translateX(0)}50%{transform:translateX(24px)}}
        .st-cloud-a{animation:st-drift 48s linear infinite alternate}
        .st-cloud-b{animation:st-drift 68s linear infinite alternate-reverse}
        .st-sheep{animation:st-bob 3.4s ease-in-out infinite}
        .st-sheep-2{animation-duration:4.1s;animation-delay:.6s}
        .st-horse{animation:st-graze 24s ease-in-out infinite}
        .st-puff{animation:st-smoke 4.2s ease-out infinite}
        .st-puff-2{animation-delay:1.4s}
        .st-puff-3{animation-delay:2.8s}
      `}</style>
    </svg>
  );
}

/** Алхан хээ — дэлгэцийн хүрээ */
export function Khee({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 15"
      preserveAspectRatio="none"
      aria-hidden
      className={`pointer-events-none h-[15px] w-full opacity-40 ${className}`}
    >
      <defs>
        <pattern id="alkhan-strip" width="30" height="15" patternUnits="userSpaceOnUse">
          <path d="M2 12V5h8v5h5V3h8v9" fill="none" stroke="var(--c-blue)" strokeWidth="2" strokeLinecap="square" />
        </pattern>
      </defs>
      <rect width="120" height="15" fill="url(#alkhan-strip)" />
    </svg>
  );
}
