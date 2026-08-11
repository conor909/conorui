"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import { useReducedMotion, useRevealVariants, useSectionReveal } from "@/lib/motion";
import styles from "./Projects.module.scss";

export default function Projects() {
  const reducedMotion = useReducedMotion();
  const { container, item } = useRevealVariants(reducedMotion);
  const { ref: headerRef, visible: headerVisible } = useSectionReveal<HTMLDivElement>(0.4);
  const { ref: gridRef, visible: gridVisible } = useSectionReveal<HTMLDivElement>(0.15);

  return (
    <section id="projects" className={styles.projects} aria-label="Projects">
      <div className={styles.inner}>
        <motion.div
          ref={headerRef}
          className={styles.header}
          variants={container}
          initial="hidden"
          animate={headerVisible ? "visible" : "hidden"}
        >
          <motion.div className={styles.hudLabel} variants={item}>
            <span>03 · 04</span>
            <span>— PROJECTS</span>
          </motion.div>
          <motion.h2 className={styles.heading} variants={item}>
            Personal projects
          </motion.h2>
        </motion.div>

        <motion.div
          ref={gridRef}
          className={styles.grid}
          variants={container}
          initial="hidden"
          animate={gridVisible ? "visible" : "hidden"}
        >
          {site.projects.map((project) => (
            <motion.article key={project.slug} className={styles.card} variants={item}>
              <div className={styles.thumb}>
                <Image
                  src={project.image}
                  alt={`${project.name} placeholder image`}
                  fill
                  unoptimized
                  sizes="(min-width: 1120px) 33vw, (min-width: 760px) 50vw, 100vw"
                />
                <span className={styles.status}>{project.status}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{project.name}</h3>
                <p className={styles.cardDescription}>{project.description}</p>
                <div className={styles.platforms}>
                  <div className={styles.platformList}>
                    {project.platforms.map((platform) => (
                      <span key={platform} className={styles.platform}>
                        {platform}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <a href={project.link} className={styles.cardLink} target="_blank" rel="noopener noreferrer">
                      Visit <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
