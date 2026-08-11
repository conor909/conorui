"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";
import { useReducedMotion, useRevealVariants, useSectionReveal } from "@/lib/motion";
import ClientLogos from "./ClientLogos";
import styles from "./About.module.scss";

export default function About() {
  const reducedMotion = useReducedMotion();
  const { container, item } = useRevealVariants(reducedMotion);
  const { ref, visible } = useSectionReveal<HTMLDivElement>(0.3);

  return (
    <section id="about" className={styles.about} aria-label="About">
      <motion.div
        ref={ref}
        className={styles.inner}
        variants={container}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
      >
        <div className={styles.header}>
          <motion.div className={styles.hudLabel} variants={item}>
            <span>02 · 04</span>
            <span>— ABOUT</span>
          </motion.div>
          <motion.h2 className={styles.heading} variants={item}>
            About
          </motion.h2>
          <motion.p className={styles.lead} variants={item}>
            {site.bio.lead}
          </motion.p>
          <motion.div className={styles.highlights} variants={item}>
            {site.bio.highlights.map((highlight) => (
              <span key={highlight} className={styles.chip}>
                {highlight}
              </span>
            ))}
          </motion.div>
        </div>

        <div className={styles.body}>
          {site.bio.paragraphs.map((paragraph) => (
            <motion.p key={paragraph} className={styles.paragraph} variants={item}>
              {paragraph}
            </motion.p>
          ))}
        </div>

        <ClientLogos reducedMotion={reducedMotion} />
      </motion.div>
    </section>
  );
}
