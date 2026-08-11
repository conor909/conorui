"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { CursorOffset } from "./ScrollCamera";

const MAX_OFFSET_X = 0.55;
const MAX_OFFSET_Y = 0.32;
const DAMPING = 4.5;

type CursorParallaxProps = {
  /** Off under `prefers-reduced-motion` and on coarse/touch pointers. */
  enabled: boolean;
  offsetRef: RefObject<CursorOffset>;
};

/**
 * Secondary cursor-driven offset layered on top of ScrollCamera's
 * scroll-driven position. Tracks window pointer movement, smooths it, and
 * writes the result into a shared ref that ScrollCamera adds to its own
 * scroll-computed target each frame.
 */
export default function CursorParallax({ enabled, offsetRef }: CursorParallaxProps) {
  const targetOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    targetOffset.current.x = 0;
    targetOffset.current.y = 0;

    if (!enabled) return;

    const resetOffset = () => {
      targetOffset.current.x = 0;
      targetOffset.current.y = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      // On a hybrid-pointer device (e.g. a touchscreen laptop that still
      // reports a "fine" primary pointer), a touch tap fires pointer
      // events too and would otherwise leave the parallax offset stuck at
      // the tap location. Ignore touch input here — it's not the cursor —
      // and reset below on pointerup/pointercancel in case a touch drag
      // did set a target before we noticed.
      if (event.pointerType === "touch") return;
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      targetOffset.current.x = nx * MAX_OFFSET_X;
      targetOffset.current.y = -ny * MAX_OFFSET_Y;
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (event.pointerType === "touch") resetOffset();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [enabled]);

  useFrame((_state, delta) => {
    const offset = offsetRef.current;
    const target = enabled ? targetOffset.current : { x: 0, y: 0 };
    const alpha = 1 - Math.exp(-DAMPING * delta);
    offset.x += (target.x - offset.x) * alpha;
    offset.y += (target.y - offset.y) * alpha;
  });

  return null;
}
