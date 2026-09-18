"use client";

import { useMemo } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { activeSectionIndex, useSectionBoundaries } from "@/lib/scroll-progress";
import styles from "./Nav.module.scss";

type NavProps = {
  /** 0–1 scroll progress, the same shared value driving the 3D scene. */
  progress: number;
};

export default function Nav({ progress }: NavProps) {
  // Sections rarely render at exactly equal heights (bio length, card
  // counts, viewport size all vary), so the active link is driven by each
  // section's actual measured position rather than an assumed equal split.
  const sectionIds = useMemo(() => site.nav.map((item) => item.id), []);
  const boundaries = useSectionBoundaries(sectionIds);
  const activeIndex = useMemo(
    () => activeSectionIndex(progress, boundaries),
    [progress, boundaries],
  );

  return (
    <>
      <div className={styles.progress} aria-hidden="true">
        <div
          className={styles.progressFill}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <nav className={styles.nav} aria-label="Section navigation">
        <a href="#hero" className={styles.brand}>
          <span className={styles.brandMark}>&#9670;</span>
          <span className={styles.brandFull}>CONOR MCGRATH</span>
          <span className={styles.brandShort}>CM</span>
        </a>
        <div className={styles.links}>
          {site.nav.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`${styles.link} ${index === activeIndex ? styles.linkActive : ""}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}
          <Link href="/blog" className={styles.link}>
            Blog
          </Link>
        </div>
      </nav>
    </>
  );
}
