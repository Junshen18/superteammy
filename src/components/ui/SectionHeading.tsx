"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
  labelColor?: "purple" | "green";
}

export function SectionHeading({
  label,
  title,
  subtitle,
  labelColor = "purple",
}: SectionHeadingProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center max-w-3xl mx-auto"
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.2em] mb-4 ${
          labelColor === "green" ? "text-solana-green" : "text-solana-purple"
        }`}
      >
        {label}
      </p>
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
