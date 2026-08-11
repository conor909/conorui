"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/content/site";
import { useReducedMotion, useRevealVariants, useSectionReveal } from "@/lib/motion";
import styles from "./Contact.module.scss";

const SWAP_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Contact form: submits to POST /api/contact, which sends the message via
 * SendGrid (SENDGRID_API_KEY, server-side only). "company" is a honeypot —
 * hidden from real users via CSS, so a filled-in value flags a bot.
 */
export default function Contact() {
  const reducedMotion = useReducedMotion();
  const { container, item } = useRevealVariants(reducedMotion);
  const { ref, visible } = useSectionReveal<HTMLDivElement>(0.3);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Looked up by explicit `type` rather than assumed array position, so
  // reordering `site.contact.links` can't silently mislabel a different
  // link as "email" here.
  const emailLink = site.contact.links.find((link) => link.type === "email");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data: { ok: boolean; error?: string } = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("idle");
      setSubmitted(true);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  // Lets the user get back to a blank form without a full page reload.
  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
    setErrorMessage("");
  };

  const swapMotionProps = reducedMotion
    ? {
        initial: {
          opacity: 0,
        },
        animate: {
          opacity: 1,
        },
        exit: {
          opacity: 0,
        },
        transition: {
          duration: 0.3,
          ease: "linear" as const,
        },
      }
    : {
        initial: {
          opacity: 0,
          y: 12,
        },
        animate: {
          opacity: 1,
          y: 0,
        },
        exit: {
          opacity: 0,
          y: -12,
        },
        transition: {
          duration: 0.4,
          ease: SWAP_EASE,
        },
      };

  return (
    <section id="contact" className={styles.contact} aria-label="Contact">
      <motion.div
        ref={ref}
        className={styles.inner}
        variants={container}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
      >
        <div className={styles.header}>
          <motion.div className={styles.hudLabel} variants={item}>
            <span>04 · 04</span>
            <span>— CONTACT</span>
          </motion.div>
          <motion.h2 className={styles.heading} variants={item}>
            {site.contact.heading}
          </motion.h2>
          <motion.p className={styles.body} variants={item}>
            {site.contact.body}
          </motion.p>

          <motion.div className={styles.links} variants={item}>
            {site.contact.links.map((link) => (
              <a
                key={link.type}
                href={link.href}
                className={styles.linkItem}
                target={link.type === "website" || link.type === "linkedin" ? "_blank" : undefined}
                rel={link.type === "website" || link.type === "linkedin" ? "noopener noreferrer" : undefined}
              >
                <span className={styles.linkHud}>{link.hud}</span>
                <span className={styles.linkLabel}>{link.label}</span>
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div className={styles.formPanel} variants={item}>
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.div key="success" className={styles.success} role="status" {...swapMotionProps}>
                <span className={styles.successMark}>MESSAGE SENT</span>
                <p className={styles.successBody}>
                  Thanks{name ? `, ${name}` : ""}. Your message is on its way, I&apos;ll reply as soon as I can. You can also reach me directly at{" "}
                  {emailLink ? <a href={emailLink.href}>{emailLink.label}</a> : "email"} or on LinkedIn above.
                </p>
                <button type="button" className={styles.resetButton} onClick={handleReset}>
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" className={styles.form} onSubmit={handleSubmit} {...swapMotionProps}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="name">
                    Name
                  </label>
                  <input id="name" name="name" className={styles.input} type="text" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email
                  </label>
                  <input id="email" name="email" className={styles.input} type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="message">
                    Message
                  </label>
                  <textarea id="message" name="message" className={styles.textarea} required value={message} onChange={(event) => setMessage(event.target.value)} />
                </div>
                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} />
                </div>
                {status === "error" && (
                  <p className={styles.formError} role="alert">
                    {errorMessage}
                  </p>
                )}
                <button type="submit" className={styles.submit} disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <div className={styles.footerNote}>
        <span>
          &copy; {new Date().getFullYear()} {site.profile.name}
        </span>
      </div>
    </section>
  );
}
