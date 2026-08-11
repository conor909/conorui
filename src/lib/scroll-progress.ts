"use client";

import { useEffect, useState } from "react";

/**
 * Single shared source of truth for scroll position across the whole page,
 * normalized to 0 (top) – 1 (bottom). Both the persistent 3D scene
 * (ScrollCamera) and the page chrome (Nav active-state) read from this so
 * there is exactly one notion of "how far through the page" the user is —
 * no independent per-section scroll state.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? clamp01(scrollTop / scrollable) : 0;
      setProgress(next);
    };

    const onScrollOrResize = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    // A web-font swap or an entrance animation can briefly change the
    // document's height right after load, without firing `scroll` or
    // `resize`. Observing the body catches those content-driven height
    // changes too, so early progress samples don't go stale until the
    // next real scroll/resize.
    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(onScrollOrResize);
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      resizeObserver?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// ---------------------------------------------------------------------------
// Per-section boundary measurement — shared by Nav (active-link highlight)
// and ScrollCamera (waypoint blending) so neither has to assume the four
// sections render at equal heights. Each section's real rendered position
// (via `getBoundingClientRect`) is measured against the same scrollable
// height used above, producing a [start, end) range in the same 0–1 scroll
// progress space for every section id supplied.
// ---------------------------------------------------------------------------

export type SectionBoundary = { id: string; start: number; end: number };

/** Equal-quartile-style split, used only as the pre-measurement fallback
 * (first paint, before the DOM has real section positions to read). */
function equalSplit(ids: string[]): SectionBoundary[] {
  const count = ids.length;
  if (count === 0) return [];
  return ids.map((id, index) => ({
    id,
    start: index / count,
    end: (index + 1) / count,
  }));
}

/**
 * Measures each section id's actual [start, end) range of the 0–1 scroll
 * progress space, based on its real rendered position, and re-measures on
 * resize and on any content-height change (ResizeObserver on `body`).
 */
export function useSectionBoundaries(ids: string[]): SectionBoundary[] {
  const key = ids.join("|");
  const [boundaries, setBoundaries] = useState<SectionBoundary[]>(() => equalSplit(ids));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const idList = key ? key.split("|") : [];

    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0 || idList.length === 0) {
        setBoundaries(equalSplit(idList));
        return;
      }

      const tops = idList.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY;
      });

      const next: SectionBoundary[] = idList.map((id, index) => {
        const fallbackStart = index / idList.length;
        const start =
          tops[index] != null ? clamp01(tops[index]! / scrollable) : fallbackStart;
        const isLast = index === idList.length - 1;
        const nextTop = tops[index + 1];
        const end = isLast
          ? 1
          : nextTop != null
            ? clamp01(nextTop / scrollable)
            : (index + 1) / idList.length;
        return { id, start, end };
      });

      setBoundaries(next);
    };

    let frame = 0;
    const scheduleMeasure = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();
    window.addEventListener("resize", scheduleMeasure);

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleMeasure);
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener("resize", scheduleMeasure);
      resizeObserver?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return boundaries;
}

/** Index of the section whose measured [start, end) range contains `progress`. */
export function activeSectionIndex(progress: number, boundaries: SectionBoundary[]): number {
  if (boundaries.length === 0) return 0;
  for (let i = 0; i < boundaries.length; i++) {
    if (progress < boundaries[i].end || i === boundaries.length - 1) {
      return i;
    }
  }
  return boundaries.length - 1;
}

/**
 * Continuous position in [0, boundaries.length - 1] for blending between
 * per-section values (e.g. camera waypoints): the integer part is the
 * active section's index, the fractional part is how far through that
 * section's actual measured range `progress` currently sits — so blending
 * genuinely tracks which section is on screen rather than assuming equal
 * quarters.
 */
export function sectionScale(progress: number, boundaries: SectionBoundary[]): number {
  if (boundaries.length <= 1) return 0;
  const index = activeSectionIndex(progress, boundaries);
  const b = boundaries[index];
  const span = Math.max(b.end - b.start, 1e-6);
  const localT = clamp01((progress - b.start) / span);
  return Math.min(boundaries.length - 1, index + localT);
}
