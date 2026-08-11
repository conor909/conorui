"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import { useRevealVariants, useSectionReveal } from "@/lib/motion";
import styles from "./ClientLogos.module.scss";

type ClientLogosProps = {
  reducedMotion: boolean;
};

export default function ClientLogos({ reducedMotion }: ClientLogosProps) {
  const { container, item } = useRevealVariants(reducedMotion);
  const { ref, visible } = useSectionReveal<HTMLDivElement>(0.3);

  return (
    <motion.div
      ref={ref}
      className={styles.clients}
      variants={container}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <motion.div className={styles.hudLabel} variants={item}>
        <span>WORKED WITH</span>
      </motion.div>
      <motion.div className={styles.row} variants={item}>
        {site.clients.map((client) => (
          <div key={client.name} className={styles.logo} title={client.name}>
            <Image
              src={client.logo}
              alt={client.name}
              fill
              unoptimized
              sizes="160px"
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
