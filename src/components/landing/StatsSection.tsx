"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { Stat } from "@/lib/types";

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="impact" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/stats-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          unoptimized
          priority={false}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
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
                Powered by Builders
              </motion.span>
            </div>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/50 leading-relaxed max-w-3xl mx-auto">
            From local meetups to global opportunities, our community continues
            to grow through shipped projects, hosted events, and meaningful
            contributions across the ecosystem.
          </p>
        </motion.div>

        {/* Malaysia Map - larger, overlaps title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 flex justify-center -mt-8 md:-mt-16 mb-12 md:mb-16"
        >
          <div className="w-full max-w-6xl xl:max-w-7xl aspect-[1180/516] relative">
            <Image
              src="/malaysia-map.svg"
              alt="Malaysia"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* Stats - Index 64px, Label 16px, responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="text-center"
            >
              <div className="font-[family-name:var(--font-orbitron)] font-bold text-white mb-1 md:mb-2 tabular-nums text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem]">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/90 uppercase tracking-wider text-xs sm:text-sm md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
