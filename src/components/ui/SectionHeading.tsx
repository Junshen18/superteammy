"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SectionHeadingProps {
  title: string;
  labelColor?: "purple" | "green";
  subtitle?: string;
}

export function SectionHeading({
  title,
  subtitle,
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
      <h2 className="font-[family-name:var(--font-orbitron)] text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[16px] text-white/90">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
