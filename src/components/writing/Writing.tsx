"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/posts";
import { formatPostDate } from "@/lib/format-date";
import { useReducedMotion, useRevealVariants, useSectionReveal } from "@/lib/motion";
import styles from "./Writing.module.scss";

export default function Writing({ posts }: { posts: Post[] }) {
  const reducedMotion = useReducedMotion();
  const { container, item } = useRevealVariants(reducedMotion);
  const { ref: headerRef, visible: headerVisible } = useSectionReveal<HTMLDivElement>(0.4);
  const { ref: gridRef, visible: gridVisible } = useSectionReveal<HTMLDivElement>(0.15);

  if (posts.length === 0) return null;

  return (
    <section id="writing" className={styles.writing} aria-label="Writing">
      <div className={styles.inner}>
        <motion.div
          ref={headerRef}
          className={styles.header}
          variants={container}
          initial="hidden"
          animate={headerVisible ? "visible" : "hidden"}
        >
          <motion.div className={styles.hudLabel} variants={item}>
            <span>— WRITING</span>
          </motion.div>
          <motion.h2 className={styles.heading} variants={item}>
            From the blog
          </motion.h2>
        </motion.div>

        <motion.div
          ref={gridRef}
          className={styles.grid}
          variants={container}
          initial="hidden"
          animate={gridVisible ? "visible" : "hidden"}
        >
          {posts.map((post) => (
            <motion.article key={post.slug} variants={item}>
              <Link href={`/blog/${post.slug}`} className={styles.card}>
                {post.image && (
                  <div className={styles.thumb}>
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 760px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className={styles.cardBody}>
                  <div className={styles.meta}>
                    <span>{formatPostDate(post.date)}</span>
                    {post.tags?.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardDescription}>{post.description}</p>
                  <span className={styles.cardLink}>
                    Read <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
