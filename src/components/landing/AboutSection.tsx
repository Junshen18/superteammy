"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center mb-0"
        >
          <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-white uppercase tracking-wide mb-4 flex flex-col items-center justify-center gap-0">
            <div className="overflow-hidden" style={{ lineHeight: 1.25 }}>
              <motion.span
                className="block text-center will-change-transform"
                style={{ lineHeight: 1.25 }}
                initial={{ y: 60 }}
                animate={inView ? { y: 0 } : { y: 60 }}
                transition={{
                  duration: 0.9,
                  ease: [0.77, 0, 0.175, 1],
                }}
              >
                About
              </motion.span>
            </div>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
            Superteam Malaysia is the local chapter of the global Superteam network, dedicated to empowering builders, creators, founders, and talent in the Solana ecosystem across Malaysia.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
