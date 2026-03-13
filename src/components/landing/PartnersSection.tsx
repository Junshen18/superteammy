"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { Partner } from "@/lib/types";

interface PartnersSectionProps {
  partners: Partner[];
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="ecosystem" className="py-24 md:py-32 bg-background">
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
                Ecosystem Partners
              </motion.span>
            </div>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
            Partners that support the Malaysian builder ecosystem through tools, mentorship, and opportunities.
          </p>
        </motion.div>

        <div className="flex flex-col items-center mt-16">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-6xl mx-auto">
            {partners.map((partner, index) => (
              <motion.a
                key={partner.id}
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex items-center justify-center h-[100px] p-4 rounded-[8px] bg-[#222222] border border-white/10 hover:border-white/20 hover:brightness-110 transition-all duration-300 overflow-hidden shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-1.2rem)]"
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt=""
                    className="w-full h-full max-w-[80%] max-h-[100%] object-contain hover:scale-110 transition-all duration-300"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white/40 group-hover:text-white/60 transition-colors">
                    {partner.name.charAt(0)}
                  </span>
                )}
              </motion.a>
            ))}
          </div>
          <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-300 text-white/50 text-sm font-semibold font-[family-name:var(--font-orbitron)] mt-12">
            More Partners...
          </span>
        </div>

        {/* <div className="text-center mt-12">
          <a
            href="https://t.me/superteammy"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 min-h-[40px] bg-[#20211B]/20 border border-white/10 px-6 py-3 rounded-[8px] text-sm font-semibold font-[family-name:var(--font-orbitron)] transition-colors duration-300 hover:border-white cursor-pointer"
          >
            <span
              className="absolute inset-0 z-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
              aria-hidden
            />
            <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-300 text-white group-hover:text-black">
              View More Partners
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div> */}
      </div>
    </section>
  );
}
