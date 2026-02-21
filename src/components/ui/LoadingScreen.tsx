"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useScramble } from "use-scramble";
import { SuperteamLogo } from "./SuperteamLogo";

const LOGO_ANIM_MS = 1400;
const SCRAMBLE_DURATION_MS = 1200;
const HOLD_AFTER_MS = 800;
const BAR_DURATION_S =
  (LOGO_ANIM_MS + SCRAMBLE_DURATION_MS + HOLD_AFTER_MS) / 1000;

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "scramble" | "hold" | "exit">(
    "logo"
  );
  const scrambleStarted = useRef(false);

  const { ref: scrambleRef, replay } = useScramble({
    text: "SUPERTEAM\nMALAYSIA",
    speed: 0.5,
    tick: 2,
    step: 1,
    scramble: 3,
    seed: 2,
    chance: 0.8,
    overdrive: false,
    overflow: false,
    playOnMount: false,
  });

  // Phase 1 → 2: logo finishes, start scramble
  useEffect(() => {
    const t = setTimeout(() => setPhase("scramble"), LOGO_ANIM_MS);
    return () => clearTimeout(t);
  }, []);

  // Trigger scramble replay when entering scramble phase
  useEffect(() => {
    if (phase === "scramble" && !scrambleStarted.current) {
      scrambleStarted.current = true;
      replay();
    }
  }, [phase, replay]);

  // Phase 2 → 3: scramble duration ends, hold
  useEffect(() => {
    if (phase !== "scramble") return;
    const t = setTimeout(() => setPhase("hold"), SCRAMBLE_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 3 → 4: hold ends, start exit
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => setPhase("exit"), HOLD_AFTER_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const handleExitComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const showText = phase !== "logo";

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {phase !== "exit" && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-50 flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Image
            src="/images/loading-img.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative flex flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <SuperteamLogo
                className="w-[80px] h-[62px]"
                animated={true}
                color="white"
              />
            </motion.div>

            <div className="h-12 flex items-center justify-center">
              <p
                ref={scrambleRef}
                className="font-[family-name:var(--font-orbitron)] font-bold text-lg text-white/90 text-center whitespace-pre-line transition-opacity duration-300"
                style={{ opacity: showText ? 1 : 0 }}
              />
            </div>
          </div>

          {/* Loading bar — fills over the total duration, completes before exit */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
            <motion.div
              className="h-full bg-linear-to-r from-solana-purple to-solana-green"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: BAR_DURATION_S, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
