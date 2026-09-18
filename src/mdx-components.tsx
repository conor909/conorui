import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import prose from "@/styles/prose.module.scss";

// Maps markdown-generated elements in every .mdx article body to the site's
// existing type system (serif reading copy, mono HUD accents) — see
// src/styles/prose.module.scss. Required file for @next/mdx under App Router.
const components: MDXComponents = {
  h2: ({ children }) => <h2 className={prose.h2}>{children}</h2>,
  h3: ({ children }) => <h3 className={prose.h3}>{children}</h3>,
  h4: ({ children }) => <h4 className={prose.h4}>{children}</h4>,
  p: ({ children }) => <p className={prose.p}>{children}</p>,
  ul: ({ children }) => <ul className={prose.ul}>{children}</ul>,
  ol: ({ children }) => <ol className={prose.ol}>{children}</ol>,
  li: ({ children }) => <li className={prose.li}>{children}</li>,
  a: ({ children, ...props }) => (
    <a className={prose.a} {...props}>
      {children}
    </a>
  ),
  blockquote: ({ children }) => <blockquote className={prose.blockquote}>{children}</blockquote>,
  code: ({ children }) => <code className={prose.code}>{children}</code>,
  pre: ({ children }) => <pre className={prose.pre}>{children}</pre>,
  hr: () => <hr className={prose.hr} />,
  img: ({ alt, ...props }) => (
    <Image
      alt={alt ?? ""}
      sizes="(min-width: 760px) 720px, 100vw"
      className={prose.img}
      style={{ width: "100%", height: "auto" }}
      {...(props as Omit<ImageProps, "alt">)}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
