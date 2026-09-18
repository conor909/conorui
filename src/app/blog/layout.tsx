import Link from "next/link";
import styles from "./layout.module.scss";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            &#9670;
          </span>
          <span>CONOR MCGRATH</span>
        </Link>
        <Link href="/blog" className={styles.blogLink}>
          Blog
        </Link>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
