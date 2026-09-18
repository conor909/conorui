"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";
import { fadeUp, fadeOnly, useReducedMotion } from "@/lib/motion";
import styles from "./Hero.module.scss";

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const variants = reducedMotion ? fadeOnly : fadeUp;
  const emailLink = site.contact.links.find((l) => l.type === "email");
  const linkedinLink = site.contact.links.find((l) => l.type === "linkedin");

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      <div className={styles.inner}>
        <motion.div className={styles.hudRow} initial="hidden" animate="visible" variants={variants}>
          <span className={styles.hudDot} aria-hidden="true" />
          <span>01 · 04</span>
          <span className={styles.hudLine} aria-hidden="true" />
          <span>{site.profile.location}</span>
        </motion.div>

        <motion.div
          className={styles.titleBlock}
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{
            delay: 0.08,
          }}
        >
          <h1 className={styles.name}>
            {site.profile.name}
            <span className={styles.credential}>{site.profile.credential}</span>
          </h1>
          <p className={styles.role}>
            <span className={styles.roleBracket}>[</span>
            {site.profile.role}
            <span className={styles.roleBracket}>]</span>
          </p>
        </motion.div>

        <motion.p
          className={styles.tagline}
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{
            delay: 0.16,
          }}
        >
          {site.profile.tagline}
        </motion.p>

        <motion.div
          className={styles.meta}
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{
            delay: 0.22,
          }}
        >
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>EMAIL</span>
            <span className={styles.metaValue}>{emailLink?.label}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>LINKEDIN</span>
            <a
              href={linkedinLink?.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.metaValue} ${styles.metaLink}`}
            >
              {linkedinLink?.label}
            </a>
          </span>
        </motion.div>
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <span className={styles.scrollCueLine} />
        <span>SCROLL</span>
      </div>
    </section>
  );
}
