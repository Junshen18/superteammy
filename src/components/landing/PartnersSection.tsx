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
    <section className="py-24 md:py-32 bg-[#0D0D20]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Ecosystem"
          title="Partners & Projects"
          subtitle="Trusted by leading Solana projects and Malaysian ecosystem partners"
          labelColor="green"
        />

        <div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-16"
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
              className="group flex items-center justify-center p-8 rounded-2xl bg-surface/30 border border-white/5 hover:border-solana-purple/20 hover:bg-surface/60 transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/10 transition-colors overflow-hidden">
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-muted group-hover:text-white transition-colors">
                      {partner.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-muted group-hover:text-white transition-colors">
                  {partner.name}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
