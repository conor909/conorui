"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";
import ScrollCamera, { type CursorOffset } from "./ScrollCamera";
import CursorParallax from "./CursorParallax";
import { useReducedMotion, useIsCoarsePointer } from "@/lib/motion";
import styles from "./Scene.module.scss";

const WIRE = "#9195a0";
const INK = "#0c0d10";
const INK_SOFT = "#4a4d55";
const PAPER = "#fcfcfb";

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * The single elegant wireframe/soft-matte-white form the camera flies past —
 * an icosahedron core with a faint matte fill, a thin wireframe overlay, and
 * two sparse HUD rings. Idle rotation is disabled under reduced motion so
 * the frame is genuinely static.
 */
function CentralForm({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (reducedMotion || !group.current) return;
    group.current.rotation.y += delta * 0.055;
    group.current.rotation.x += delta * 0.014;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.28} roughness={0.75} metalness={0} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.61, 1]} />
        <meshBasicMaterial color={WIRE} wireframe transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.4, 0]}>
        <torusGeometry args={[3.2, 0.006, 8, 96]} />
        <meshBasicMaterial color={INK} transparent opacity={0.09} />
      </mesh>
      <mesh rotation={[Math.PI / 1.6, 0.8, 0.3]}>
        <torusGeometry args={[4.15, 0.005, 8, 96]} />
        <meshBasicMaterial color={INK_SOFT} transparent opacity={0.07} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshBasicMaterial color={WIRE} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

type SceneContentsProps = {
  progress: number;
  reducedMotion: boolean;
  coarsePointer: boolean;
};

function SceneContents({ progress, reducedMotion, coarsePointer }: SceneContentsProps) {
  const cursorOffset = useRef<CursorOffset>({ x: 0, y: 0 });

  return (
    <>
      <color attach="background" args={[PAPER]} />
      <fog attach="fog" args={[PAPER, 6, 15]} />
      <ambientLight intensity={1.75} />
      <directionalLight position={[4, 5, 6]} intensity={0.28} />
      <directionalLight position={[-4, -2, -4]} intensity={0.12} />
      <CentralForm reducedMotion={reducedMotion} />
      <ScrollCamera progress={progress} reducedMotion={reducedMotion} cursorOffsetRef={cursorOffset} />
      <CursorParallax enabled={!reducedMotion && !coarsePointer} offsetRef={cursorOffset} />
    </>
  );
}

type SceneProps = {
  /** 0–1 scroll progress across the whole page, from useScrollProgress(). */
  progress: number;
};

/**
 * Fixed, full-viewport, persistent 3D backdrop. Mounted once in page.tsx via
 * a client-only dynamic import (ssr:false). Pointer events pass through so
 * nav/links/form stay clickable above the canvas. Falls back to a static
 * gradient if WebGL is unavailable, and never throws.
 */
export default function Scene({ progress }: SceneProps) {
  // Computed once, synchronously, on first client render. Scene is always
  // client-only (dynamically imported with `ssr:false`), so there is no
  // hydration mismatch to guard against, and WebGL *support* cannot change
  // mid-session — no effect/setState needed to seed it. The GPU *context*
  // can still be lost later (driver reset, memory pressure — common on
  // mobile), which is handled separately via `contextLost` below.
  const [webglSupported] = useState<boolean>(detectWebGL);
  const [contextLost, setContextLost] = useState(false);
  const reducedMotion = useReducedMotion();
  const coarsePointer = useIsCoarsePointer();

  // If the GPU context is lost after mount, prevent the default (which
  // would otherwise leave the canvas blank) and fall back to the same
  // static background used when WebGL isn't supported at all, per the
  // spec's "render a static fallback instead of crashing" boundary.
  const handleCreated = useCallback((state: RootState) => {
    const canvasEl = state.gl.domElement;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    canvasEl.addEventListener("webglcontextlost", onContextLost, false);
  }, []);

  if (!webglSupported || contextLost) {
    return <div className={styles.fallback} aria-hidden="true" />;
  }

  return (
    <div className={styles.canvasWrap} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.4, 9], fov: 42, near: 0.1, far: 40 }}
        onCreated={handleCreated}
      >
        <Suspense fallback={null}>
          <SceneContents
            progress={progress}
            reducedMotion={reducedMotion}
            coarsePointer={coarsePointer}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
