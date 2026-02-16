"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code2,
  Calendar,
  Coins,
  Briefcase,
  GraduationCap,
  Globe,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    icon: Code2,
    title: "Builder Support",
    description: "Mentorship and resources for Solana developers at every level",
  },
  {
    icon: Calendar,
    title: "Events & Hackathons",
    description: "Regular meetups, hackathons, and workshops across Malaysia",
  },
  {
    icon: Coins,
    title: "Grants & Funding",
    description: "Access to Solana grants and funding for your projects",
  },
  {
    icon: Briefcase,
    title: "Jobs & Bounties",
    description: "Earn opportunities in the Solana ecosystem",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Workshops and learning programs for all skill levels",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Connect with Superteam chapters worldwide",
  },
];

export function MissionSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="py-24 md:py-32 bg-[#0D0D20]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="What We Do"
          title="Empowering Malaysia's Web3 Builders"
          subtitle="We provide the tools, community, and opportunities to help you build on Solana"
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-surface/50 border border-white/5 hover:border-solana-purple/20 transition-all duration-300 hover:bg-surface"
            >
              <div className="w-12 h-12 rounded-xl bg-solana-green/10 flex items-center justify-center mb-5 group-hover:bg-solana-green/15 transition-colors">
                <pillar.icon className="w-6 h-6 text-solana-green" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
