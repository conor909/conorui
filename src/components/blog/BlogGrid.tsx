"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/posts";
import { formatPostDate } from "@/lib/format-date";
import { useReducedMotion, useRevealVariants, useSectionReveal } from "@/lib/motion";
import styles from "./BlogGrid.module.scss";

export default function BlogGrid({ posts }: { posts: Post[] }) {
  const reducedMotion = useReducedMotion();
  const { container, item } = useRevealVariants(reducedMotion);
  const { ref, visible } = useSectionReveal<HTMLDivElement>(0.15);

  return (
    <motion.div
      ref={ref}
      className={styles.grid}
      variants={container}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      {posts.map((post) => (
        <motion.div key={post.slug} variants={item}>
          <Link href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.meta}>
              <span>{formatPostDate(post.date)}</span>
              {post.tags?.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <p className={styles.cardDescription}>{post.description}</p>
            </div>
            <span className={styles.cardLink}>
              Read <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
