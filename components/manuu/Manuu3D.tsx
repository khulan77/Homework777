"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Mood } from "@/lib/tutor/types";
import type { CostumeId } from "./costumes";

/**
 * 3D Мануу — мануул (Pallas's cat).
 *
 * Загварыг ФАЙЛААС ТАТАХГҮЙ, кодоор барина. Яагаад:
 *  · Тайлбар болгон харьцуулбал жишиг сайт 3.8MB-ийн .glb татдаг. Архангайд
 *    тогтворгүй 4G-ээр ордог хүүхдэд энэ нь 30+ секунд.
 *  · Сэтгэл хөдлөл бүрийг код дотор бүрэн хянана — анимац тус бүрд файл хэрэггүй.
 *  · Дүр нь бүтээгдэхүүний өмч болно, гадны загвараас хамаарахгүй.
 *
 * Low-poly + flatShading нь «муу загвар» биш, ЗОРИУДЫН хэв маяг — сегмент цөөн
 * байх тусам утас дээр хурдан, харагдац нь тодорхой.
 */

const FUR = "#CDAE87";
const FUR_LIGHT = "#F0DFC6";
const FUR_DARK = "#6E5943";
const IRIS = "#F2A93B";
const NOSE = "#B9705F";

interface CatProps {
  mood: Mood;
  costume: CostumeId;
  talking: boolean;
}

function Manul({ mood, costume, talking }: CatProps) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const earL = useRef<THREE.Group>(null);
  const earR = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Group>(null);
  const eyeR = useRef<THREE.Group>(null);
  const pupils = useRef<THREE.Group>(null);
  const muzzle = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  // Анивчих, үсрэх мөчлөгийн цаг. useState биш — дахин render хийхгүй.
  const clock = useRef({ blink: 0, hop: 0, lastMood: mood });

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const c = clock.current;

    /* ── амьсгал ── */
    if (root.current) {
      root.current.scale.y = 1 + Math.sin(t * 1.7) * 0.02;
      root.current.position.y = Math.sin(t * 1.7) * 0.015;
    }

    /* ── баярлахад үсрэх ── */
    if (c.lastMood !== mood) {
      if (mood === "joy") c.hop = 0.62;
      c.lastMood = mood;
    }
    if (c.hop > 0) {
      c.hop = Math.max(0, c.hop - dt);
      const p = 1 - c.hop / 0.62;
      root.current!.position.y += Math.sin(p * Math.PI) * 0.42;
      root.current!.rotation.y = Math.sin(p * Math.PI * 2) * 0.22;
    } else if (root.current) {
      root.current.rotation.y *= 0.9;
    }

    /* ── толгойн хазайлт + харцаар дагах ── */
    if (head.current) {
      const tilt =
        mood === "think" ? -0.22 : mood === "curious" ? 0.2 : mood === "calm" ? -0.12 : 0;
      head.current.rotation.z += (tilt - head.current.rotation.z) * 0.12;
      // Хулгана/хуруу руу зөөлөн эргэнэ — хамгийн хямд «амьд» мэдрэмж
      const ty = pointer.x * 0.34;
      const tx = -pointer.y * 0.2 + (mood === "think" ? -0.16 : 0);
      head.current.rotation.y += (ty - head.current.rotation.y) * 0.08;
      head.current.rotation.x += (tx - head.current.rotation.x) * 0.08;
    }

    /* ── чих сэрдэх ── */
    const perk = mood === "curious" ? 0.34 : 0;
    const twitch = Math.sin(t * 0.8) > 0.985 ? 0.25 : 0;
    if (earL.current) earL.current.rotation.z += (0.35 + perk + twitch - earL.current.rotation.z) * 0.15;
    if (earR.current) earR.current.rotation.z += (-0.35 - perk - twitch - earR.current.rotation.z) * 0.15;

    /* ── нүд: анивчих, баярлахад нарийсах ── */
    c.blink -= dt;
    if (c.blink < -2.4 && Math.random() < 0.02) c.blink = 0.13;
    const blinking = c.blink > 0;
    const lidY = mood === "joy" ? 0.16 : blinking ? 0.08 : 1;
    for (const e of [eyeL.current, eyeR.current]) {
      if (e) e.scale.y += (lidY - e.scale.y) * 0.45;
    }
    // Хүүхэн хараа хулганыг дагана
    if (pupils.current) {
      pupils.current.position.x = pointer.x * 0.045;
      pupils.current.position.y = pointer.y * 0.03;
    }

    /* ── ярихад ам хөдлөх ── */
    if (muzzle.current) {
      const open = talking ? 1 + Math.abs(Math.sin(t * 14)) * 0.35 : 1;
      muzzle.current.scale.y += (open - muzzle.current.scale.y) * 0.4;
    }
  });

  const eye = useMemo(
    () => (
      <>
        <mesh>
          <sphereGeometry args={[0.17, 14, 12]} />
          <meshStandardMaterial color="#FFFDF7" flatShading />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color={IRIS} flatShading />
        </mesh>
      </>
    ),
    [],
  );

  return (
    <group ref={root} position={[0, -0.35, 0]}>
      {/* ── бие ── */}
      <mesh position={[0, -0.62, 0]} castShadow>
        <sphereGeometry args={[0.62, 14, 12]} />
        <meshStandardMaterial color={FUR} flatShading />
      </mesh>
      <mesh position={[0, -0.68, 0.34]}>
        <sphereGeometry args={[0.42, 12, 10]} />
        <meshStandardMaterial color={FUR_LIGHT} flatShading />
      </mesh>

      {/* сүүл — мануулын зузаан сүүл */}
      <mesh position={[0.52, -0.88, -0.36]} rotation={[0.5, 0, -0.7]}>
        <capsuleGeometry args={[0.16, 0.5, 4, 10]} />
        <meshStandardMaterial color={FUR} flatShading />
      </mesh>

      {/* сарвуу */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, -1.05, 0.26]}>
          <sphereGeometry args={[0.17, 10, 8]} />
          <meshStandardMaterial color={FUR_LIGHT} flatShading />
        </mesh>
      ))}

      <Costume id={costume} />

      {/* ── толгой ── */}
      <group ref={head} position={[0, 0.12, 0]}>
        {/* үсэрхэг хүрээ — мануулын өргөн царай */}
        <mesh scale={[1.16, 0.95, 0.92]}>
          <sphereGeometry args={[0.78, 16, 14]} />
          <meshStandardMaterial color={FUR} flatShading />
        </mesh>
        <mesh position={[0, -0.04, 0.2]} scale={[1.02, 0.86, 0.8]}>
          <sphereGeometry args={[0.7, 16, 14]} />
          <meshStandardMaterial color={FUR_LIGHT} flatShading />
        </mesh>

        {/* чих — ДООГУУР, ХАЖУУ ТИЙШ. Мануулын гол таних тэмдэг. */}
        <group ref={earL} position={[-0.82, 0.02, 0.06]}>
          <mesh scale={[0.9, 1, 0.6]}>
            <sphereGeometry args={[0.21, 10, 8]} />
            <meshStandardMaterial color={FUR} flatShading />
          </mesh>
          <mesh position={[0.02, 0, 0.1]} scale={[0.7, 0.75, 0.4]}>
            <sphereGeometry args={[0.16, 8, 6]} />
            <meshStandardMaterial color={NOSE} flatShading />
          </mesh>
        </group>
        <group ref={earR} position={[0.82, 0.02, 0.06]}>
          <mesh scale={[0.9, 1, 0.6]}>
            <sphereGeometry args={[0.21, 10, 8]} />
            <meshStandardMaterial color={FUR} flatShading />
          </mesh>
          <mesh position={[-0.02, 0, 0.1]} scale={[0.7, 0.75, 0.4]}>
            <sphereGeometry args={[0.16, 8, 6]} />
            <meshStandardMaterial color={NOSE} flatShading />
          </mesh>
        </group>

        {/* духны судал */}
        {[-0.17, 0, 0.17].map((x, i) => (
          <mesh key={x} position={[x, 0.48 + (i === 1 ? 0.04 : 0), 0.5]} rotation={[0.35, 0, 0]}>
            <boxGeometry args={[0.055, i === 1 ? 0.24 : 0.19, 0.04]} />
            <meshStandardMaterial color={FUR_DARK} flatShading />
          </mesh>
        ))}

        {/* нүд */}
        <group ref={pupils}>
          <group ref={eyeL} position={[-0.27, 0.06, 0.62]}>{eye}</group>
          <group ref={eyeR} position={[0.27, 0.06, 0.62]}>{eye}</group>
        </group>
        {/* хүүхэн хараа — дугуй (мануулын онцлог, муурных шиг сунасан биш) */}
        {[-0.27, 0.27].map((x) => (
          <mesh key={x} position={[x, 0.06, 0.73]}>
            <sphereGeometry args={[0.062, 10, 8]} />
            <meshStandardMaterial color="#2A2118" flatShading />
          </mesh>
        ))}

        {/* хамар ба ам */}
        <mesh ref={muzzle} position={[0, -0.22, 0.66]} scale={[1, 1, 1]}>
          <sphereGeometry args={[0.19, 12, 10]} />
          <meshStandardMaterial color={FUR_LIGHT} flatShading />
        </mesh>
        <mesh position={[0, -0.15, 0.8]}>
          <sphereGeometry args={[0.058, 8, 6]} />
          <meshStandardMaterial color={NOSE} flatShading />
        </mesh>

        {/* хацрын судал */}
        {[-1, 1].map((s) =>
          [0.02, -0.14].map((y) => (
            <mesh key={`${s}${y}`} position={[s * 0.62, y, 0.42]} rotation={[0, s * 0.5, 0]}>
              <boxGeometry args={[0.16, 0.035, 0.03]} />
              <meshStandardMaterial color={FUR_DARK} flatShading opacity={0.75} transparent />
            </mesh>
          )),
        )}

        {costume === "space" && (
          <mesh>
            <sphereGeometry args={[1.02, 20, 16]} />
            <meshPhysicalMaterial
              color="#BFE6F8"
              transparent
              opacity={0.24}
              roughness={0.05}
              metalness={0.1}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

/** Хувцаснууд — шагнал нь оноо биш, ЭНЭ. */
function Costume({ id }: { id: CostumeId }) {
  if (id === "deel") {
    return (
      <group>
        {/* монгол дээлийн бүс */}
        <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.075, 8, 20]} />
          <meshStandardMaterial color="#C8412F" flatShading />
        </mesh>
        {/* хөх зах */}
        <mesh position={[0, -0.2, 0.2]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.46, 0.07, 8, 18]} />
          <meshStandardMaterial color="#2E7DBF" flatShading />
        </mesh>
      </group>
    );
  }
  if (id === "space") {
    return (
      <group>
        {/* хийн сав */}
        <mesh position={[0, -0.6, -0.5]}>
          <boxGeometry args={[0.5, 0.6, 0.24]} />
          <meshStandardMaterial color="#E8EEF3" flatShading metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.28, 0.18]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.46, 0.08, 8, 18]} />
          <meshStandardMaterial color="#E8EEF3" flatShading metalness={0.3} />
        </mesh>
      </group>
    );
  }
  if (id === "zodog") {
    return (
      <group>
        {/* бөхийн зодог — мөрний улаан хэсэг */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.44, -0.34, 0.1]} rotation={[0, 0, s * 0.4]}>
            <boxGeometry args={[0.3, 0.34, 0.42]} />
            <meshStandardMaterial color="#C8412F" flatShading />
          </mesh>
        ))}
        <mesh position={[0, -0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.58, 0.07, 8, 20]} />
          <meshStandardMaterial color="#2E7DBF" flatShading />
        </mesh>
      </group>
    );
  }
  return null;
}

export interface Manuu3DProps {
  mood?: Mood;
  costume?: CostumeId;
  talking?: boolean;
  className?: string;
}

export default function Manuu3D({
  mood = "idle",
  costume = "none",
  talking = false,
  className = "",
}: Manuu3DProps) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className={className} aria-hidden>
      <Canvas
        // Хуучин Android утсанд GPU-г шатаахгүйн тулд пиксел харьцааг таглана
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.25, 4.2], fov: 34 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
        // Хөдөлгөөн багасгах горимд нэг л удаа зурна
        frameloop={reduce ? "demand" : "always"}
      >
        <ambientLight intensity={0.85} />
        <hemisphereLight args={["#BFE6F8", "#C2A06A", 0.7]} />
        <directionalLight position={[3, 4, 3]} intensity={1.5} castShadow />
        <pointLight position={[-3, 1, 2]} intensity={0.5} color="#FFB42E" />
        <Manul mood={mood} costume={costume} talking={talking} />
      </Canvas>
    </div>
  );
}
