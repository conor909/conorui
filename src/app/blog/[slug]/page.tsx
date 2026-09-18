import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostMeta, getPostSlugs, type PostMeta } from "@/lib/posts";
import { formatPostDate } from "@/lib/format-date";
import styles from "./page.module.scss";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getPostMeta(slug).catch(() => null);
  if (!meta) return {};

  const url = `/blog/${slug}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: meta.title,
      description: meta.description,
      publishedTime: meta.date,
      tags: meta.tags,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  let Post: ComponentType;
  let meta: PostMeta;
  try {
    const mod: { default: ComponentType; meta: PostMeta } = await import(`@/content/blog/${slug}.mdx`);
    Post = mod.default;
    meta = mod.meta;
  } catch {
    notFound();
  }

  return (
    <article className={styles.article}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.meta}>
            <span>{formatPostDate(meta.date)}</span>
            {meta.tags?.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.description}>{meta.description}</p>
        </header>
        <div className={styles.body}>
          <Post />
        </div>
      </div>
    </article>
  );
}
