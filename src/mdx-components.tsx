import type { MDXComponents } from "mdx/types";
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
  // Markdown images don't carry known intrinsic dimensions, which next/image
  // requires (width/height or fill), so this uses a plain <img> instead.
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ alt, ...props }) => <img alt={alt ?? ""} loading="lazy" className={prose.img} {...props} />,
  figure: ({ children }) => <figure className={prose.figure}>{children}</figure>,
  figcaption: ({ children }) => <figcaption className={prose.caption}>{children}</figcaption>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
