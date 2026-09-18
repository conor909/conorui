import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import BlogGrid from "@/components/blog/BlogGrid";
import styles from "./page.module.scss";

const title = "Blog";
const description = "Writing on front-end engineering, data visualization, and the occasional side project.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.hudLabel}>— BLOG</span>
          <h1 className={styles.heading}>Writing &amp; visualizations</h1>
          <p className={styles.lead}>
            Notes on front-end engineering and data visualization.
          </p>
        </div>

        {posts.length > 0 ? (
          <BlogGrid posts={posts} />
        ) : (
          <p className={styles.empty}>No posts yet, check back soon.</p>
        )}
      </div>
    </div>
  );
}
