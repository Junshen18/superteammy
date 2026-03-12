"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Partner } from "@/lib/types";

interface PartnersSectionProps {
  partners: Partner[];
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="ecosystem" className="py-24 md:py-32 bg-[#0D0D20]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          title="ECOSYSTEM PARTNERS"
          subtitle="Partners that support the Malaysian builder ecosystem through tools, mentorship, and opportunities."
        />

        <div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-16"
        >
          {partners.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.website_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group flex items-center justify-center p-4 rounded-2xl bg-white/6 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all duration-300 overflow-hidden"
            >
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt=""
                  className="w-full h-full max-w-[80%] max-h-[80%] object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-white/40 group-hover:text-white/60 transition-colors">
                  {partner.name.charAt(0)}
                </span>
              )}
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-12">
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
        </div>
      </div>
    </section>
  );
}
