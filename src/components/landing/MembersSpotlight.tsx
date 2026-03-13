"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MemberProfileCard } from "@/components/members/MemberProfileCard";
import type { Profile } from "@/lib/types";
import Image from "next/image";

interface MembersSpotlightProps {
  profiles: Profile[];
}

const CARD_SCALE = 0.9;
// Card base width 320px; scaled visual width = 320*0.85. Use that so cards stick close.
const CARD_WIDTH = Math.round(320 * CARD_SCALE); // 272

export function MembersSpotlight({ profiles }: MembersSpotlightProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Row 1: from front (index 0, 1, 2, ...). Row 2: from back (last, second-last, ...)
  const { row1, row2 } = useMemo(
    () => ({
      row1: [...profiles],
      row2: [...profiles].reverse(),
    }),
    [profiles],
  );

  const renderCards = (
    rowProfiles: Profile[],
    startIndex: number,
    copyId: number,
  ) =>
    rowProfiles.map((profile, i) => (
      <motion.div
        key={`${profile.id}-${copyId}-${i}`}
        initial={{ opacity: 0, y: 20, scale: CARD_SCALE }}
        animate={
          inView
            ? { opacity: 1, y: 0, scale: CARD_SCALE }
            : { opacity: 0, y: 20, scale: CARD_SCALE }
        }
        transition={{
          duration: 0.6,
          delay: Math.min((startIndex + i) * 0.05, 0.5),
        }}
        className="shrink-0 overflow-visible flex items-center justify-center origin-center"
        style={{ width: CARD_WIDTH }}
      >
        <MemberProfileCard profile={profile} index={startIndex + i} />
      </motion.div>
    ));

  return (
    <section id="members" className="py-24 overflow-hidden relative">
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/images/member-sec-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          unoptimized
          priority={false}
        />
      </div>
      <div className="mx-20 flex flex-col gap-1 shadow-lg bg-background rounded-[16px] p-8 px-20">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center mb-0"
        >
          <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-white uppercase tracking-wide mb-2 flex flex-col items-center justify-center gap-0">
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
                Member Spotlight
              </motion.span>
            </div>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
            Meet the talented builders driving the Solana ecosystem in Malaysia
          </p>
        </motion.div>

        <div ref={ref} className="relative -mx-6 md:-mx-8 overflow-visible ">
          {/* Row 1: left to right (content scrolls left) */}
          <div className="marquee-row group -mb-5">
            <div className="marquee-track marquee-ltr">
              <div className="flex gap-0 pr-0 shrink-0 overflow-visible">
                {renderCards(row1, 0, 0)}
              </div>
              <div className="flex gap-0 pr-0 shrink-0 overflow-visible">
                {renderCards(row1, 0, 1)}
              </div>
            </div>
          </div>

          {/* Row 2: right to left (content scrolls right) */}
          <div className="marquee-row group">
            <div className="marquee-track marquee-rtl">
              <div className="flex gap-0 pr-0 shrink-0 overflow-visible">
                {renderCards(row2, profiles.length, 0)}
              </div>
              <div className="flex gap-0 pr-0 shrink-0 overflow-visible">
                {renderCards(row2, profiles.length, 1)}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/members"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 min-h-[40px] bg-[#20211B]/20 border border-white/10 px-6 py-3 rounded-[8px] text-sm font-semibold font-[family-name:var(--font-orbitron)] transition-colors duration-300 hover:border-white cursor-pointer"
          >
            <span
              className="absolute inset-0 z-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
              aria-hidden
            />
            <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-300 text-white group-hover:text-black">
              View All Members
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
