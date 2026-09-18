import { readdirSync } from "node:fs";
import path from "node:path";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type PostMeta = {
  title: string;
  description: string;
  /** ISO date string, e.g. "2026-08-20" */
  date: string;
  tags?: string[];
};

export type Post = PostMeta & { slug: string };

export function getPostSlugs(): string[] {
  return readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getPostMeta(slug: string): Promise<PostMeta> {
  const mod = await import(`@/content/blog/${slug}.mdx`);
  return mod.meta;
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => ({ slug, ...(await getPostMeta(slug)) })),
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
