"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { site } from "@/content/site";
import { sectionScale, useSectionBoundaries } from "@/lib/scroll-progress";

export type CursorOffset = { x: number; y: number };

type Waypoint = {
  position: [number, number, number];
  target: [number, number, number];
};

/**
 * One camera waypoint per section (Hero, About, Projects, Contact) — a
 * simple, legible flythrough rather than a dense multi-object journey, per
 * the spec's design notes.
 */
export const CAMERA_WAYPOINTS: Waypoint[] = [
  { position: [0, 0.4, 9], target: [0, 0, 0] }, // Hero — head-on approach
  { position: [3.6, 1.3, 5.2], target: [0.2, 0.15, 0] }, // About — orbit right
  { position: [-3.8, -0.7, 3.6], target: [-0.3, 0, 0.4] }, // Projects — swing past, low
  { position: [0, 1.9, 8.6], target: [0, -0.2, 0] }, // Contact — pull back, settle
];

const SEGMENTS = CAMERA_WAYPOINTS.length - 1;

function smoothstep01(x: number) {
  const t = THREE.MathUtils.clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
}

const scratchA = new THREE.Vector3();
const scratchB = new THREE.Vector3();

/**
 * `scale` is a continuous position in [0, SEGMENTS] — the output of
 * `sectionScale()` — not raw 0–1 scroll progress. This is what lets the
 * waypoint blend track each section's actual measured on-screen range
 * instead of assuming four equal quarters of total scroll progress.
 */
function sampleWaypoints(
  scale: number,
  outPosition: THREE.Vector3,
  outTarget: THREE.Vector3,
) {
  const scaled = THREE.MathUtils.clamp(scale, 0, SEGMENTS);
  const index = Math.min(SEGMENTS - 1, Math.floor(scaled));
  const localT = smoothstep01(scaled - index);

  const a = CAMERA_WAYPOINTS[index];
  const b = CAMERA_WAYPOINTS[index + 1];

  scratchA.set(...a.position);
  scratchB.set(...b.position);
  outPosition.copy(scratchA).lerp(scratchB, localT);

  scratchA.set(...a.target);
  scratchB.set(...b.target);
  outTarget.copy(scratchA).lerp(scratchB, localT);
}

type ScrollCameraProps = {
  /** 0–1 scroll progress across the whole page — the single shared source. */
  progress: number;
  reducedMotion: boolean;
  cursorOffsetRef: RefObject<CursorOffset>;
};

/**
 * Maps scroll progress to the camera's flythrough position/target. Disabled
 * under `prefers-reduced-motion`: the camera is set once to a static frame
 * and never updated again, per the spec's reduced-motion requirement.
 */
export default function ScrollCamera({
  progress,
  reducedMotion,
  cursorOffsetRef,
}: ScrollCameraProps) {
  const basePosition = useRef(new THREE.Vector3());
  const baseTarget = useRef(new THREE.Vector3());
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPosition = useRef(new THREE.Vector3());
  const staticFrameSet = useRef(false);

  // Sections rarely render at exactly equal heights, so the waypoint blend
  // is driven by each section's actual measured on-screen range rather
  // than dividing progress into four equal quarters.
  const sectionIds = useMemo(() => site.nav.map((item) => item.id), []);
  const boundaries = useSectionBoundaries(sectionIds);

  useFrame((state, delta) => {
    const { camera } = state;
    const scale = sectionScale(progress, boundaries);

    if (reducedMotion) {
      // Freeze at whatever waypoint pose corresponds to the *current*
      // scroll progress at the moment reduced-motion became active — not
      // a hardcoded progress=0 (Hero) pose — so a mid-scroll switch to
      // reduced motion doesn't snap the camera back to the top.
      if (!staticFrameSet.current) {
        sampleWaypoints(scale, basePosition.current, baseTarget.current);
        camera.position.copy(basePosition.current);
        currentTarget.current.copy(baseTarget.current);
        camera.lookAt(currentTarget.current);
        staticFrameSet.current = true;
      }
      return;
    }

    // Reset so that if reduced-motion toggles off and later back on, the
    // next freeze re-samples fresh instead of reusing a stale flag.
    staticFrameSet.current = false;

    sampleWaypoints(scale, basePosition.current, baseTarget.current);

    const offset = cursorOffsetRef.current;
    desiredPosition.current.copy(basePosition.current);
    desiredPosition.current.x += offset.x;
    desiredPosition.current.y += offset.y;

    // Frame-rate independent exponential damping — smooth "flying" catch-up
    // rather than a snap, while still tracking scroll continuously.
    const alpha = 1 - Math.exp(-5 * delta);
    camera.position.lerp(desiredPosition.current, alpha);
    currentTarget.current.lerp(baseTarget.current, alpha);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
