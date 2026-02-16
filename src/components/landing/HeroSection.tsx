"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { SuperteamLogo } from "@/components/ui/SuperteamLogo";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-solana-purple/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-solana-green/8 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-solana-purple/5 rounded-full blur-[200px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Animated Superteam Logo - large background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.04, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <SuperteamLogo
              className="w-[500px] h-[380px] md:w-[700px] md:h-[530px] lg:w-[900px] lg:h-[685px]"
              animated={true}
              color="white"
            />
          </motion.div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Small animated logo above badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mb-6 flex justify-center"
        >
          <SuperteamLogo
            className="w-[52px] h-[40px]"
            animated={true}
            color="url(#hero-logo-gradient)"
          />
          {/* Hidden gradient definition for the small logo */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="hero-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-solana-purple/30 bg-solana-purple/5 mb-8">
            <Sparkles className="w-4 h-4 text-solana-green" />
            <span className="text-sm text-muted">
              The Home for Solana Builders in Malaysia
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          Build the Future
          <br />
          of{" "}
          <span className="gradient-text">Web3 in Malaysia</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Superteam Malaysia connects builders, creators, and founders in the
          Solana ecosystem. Access grants, bounties, hackathons, and a global
          network of Web3 talent.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="https://t.me/superteammy"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Join Community
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://earn.superteam.fun"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-medium text-white border border-white/10 hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Opportunities
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 mx-auto flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
