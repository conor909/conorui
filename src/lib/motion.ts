"use client";

import { useCallback, useRef, useSyncExternalStore, type RefObject } from "react";
import type { Variants } from "framer-motion";

/** Subscribes to a boolean media query via `useSyncExternalStore` — the
 * React-recommended way to read external browser state without a
 * setState-in-effect anti-pattern, and it degrades safely under SSR
 * (getServerSnapshot) since `window`/`matchMedia` don't exist there. */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * SSR-safe `prefers-reduced-motion` detector. Shared by the 3D scene
 * (disables scroll camera + cursor parallax) and every section's Framer
 * Motion reveal (falls back to a simple fade).
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on touch/coarse-pointer devices — cursor parallax is disabled there. */
export function useIsCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)");
}

const EASE_HUD: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Standard reveal: fade + rise. Used by every section under normal motion. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_HUD },
  },
};

/** Reduced-motion reveal: opacity only, per the spec's fallback requirement. */
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "linear" },
  },
};

/** Stagger wrapper for grids/lists of children (e.g. project cards). */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export const staggerContainerReduced: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

/**
 * Section reveal that replays: becomes visible once at least `amount` of the
 * element is on screen, and only resets back to hidden once the element has
 * scrolled fully out of view (intersection ratio hits exactly 0) — not
 * merely below the reveal threshold — so scrolling back in replays the
 * entrance instead of re-triggering on every minor scroll wobble.
 */
export function useSectionReveal<T extends Element>(amount = 0.3): { ref: RefObject<T | null>; visible: boolean } {
  const elementRef = useRef<T | null>(null);
  const visibleRef = useRef(false);

  const subscribe = useCallback(
    (callback: () => void) => {
      const el = elementRef.current;
      if (!el || typeof IntersectionObserver === "undefined") return () => {};

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.intersectionRatio >= amount && !visibleRef.current) {
              visibleRef.current = true;
              callback();
            } else if (entry.intersectionRatio === 0 && visibleRef.current) {
              visibleRef.current = false;
              callback();
            }
          }
        },
        { threshold: [0, amount] },
      );
      observer.observe(el);
      return () => observer.disconnect();
    },
    [amount],
  );

  const getSnapshot = useCallback(() => visibleRef.current, []);

  const visible = useSyncExternalStore(subscribe, getSnapshot, () => false);

  return { ref: elementRef, visible };
}

/** Pick the correct variant pair for the current motion preference. */
export function useRevealVariants(reduced: boolean): {
  container: Variants;
  item: Variants;
} {
  return reduced
    ? { container: staggerContainerReduced, item: fadeOnly }
    : { container: staggerContainer, item: fadeUp };
}
