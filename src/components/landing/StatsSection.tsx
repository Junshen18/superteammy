"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Calendar, Code2, Trophy } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { sampleStats } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  calendar: Calendar,
  code: Code2,
  trophy: Trophy,
};

export function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-solana-green mb-4">
            Our Impact
          </p>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Growing the Solana Ecosystem
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleStats.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Users;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-surface/50 border border-white/5 text-center group hover:border-solana-purple/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-solana-purple/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-solana-purple/15 transition-colors">
                  <Icon className="w-6 h-6 text-solana-purple" />
                </div>
                <div className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold gradient-text mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
