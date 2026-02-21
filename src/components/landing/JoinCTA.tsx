"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, MessageCircle, Twitter } from "lucide-react";

export function JoinCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-solana-purple/15 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-solana-green/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-[family-name:var(--font-orbitron)] text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build with Us?
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Join Superteam Malaysia and be part of the fastest-growing Solana
            community in Southeast Asia. Whether you&apos;re a developer, designer,
            or creator — there&apos;s a place for you here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="https://t.me/superteammy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              Join Telegram
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/SuperteamMY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-medium text-white border border-white/10 hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Twitter className="w-5 h-5" />
              Follow on X
            </a>
          </div>

          {/* Trust line */}
          <p className="text-sm text-muted-dark">
            Part of the global{" "}
            <a
              href="https://superteam.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-solana-purple hover:underline"
            >
              Superteam
            </a>{" "}
            network &middot; Powered by{" "}
            <a
              href="https://solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-solana-green hover:underline"
            >
              Solana
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
