"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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
              className="group flex items-center justify-center aspect-square p-6 md:p-8 rounded-2xl bg-white/6 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all duration-300 overflow-hidden"
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

        <div className="flex justify-center mt-12">
          <a
            href="https://t.me/superteammy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white/6 border border-white/10 hover:border-white/20 hover:bg-white/8 text-white font-semibold uppercase tracking-wider text-sm transition-all duration-300"
          >
            View More Partners
          </a>
        </div>
      </div>
    </section>
  );
}
