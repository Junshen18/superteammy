"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Tweet } from "react-tweet";
import type { CommunityTweet } from "@/lib/types";
import "react-tweet/theme.css";

interface WallOfLoveProps {
  communityTweets: CommunityTweet[];
}

export function WallOfLove({ communityTweets }: WallOfLoveProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="community" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/wol-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          unoptimized
          priority={false}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
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
                Wall of Love
              </motion.span>
            </div>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto">
            Hear from builders and leaders in the Malaysian Web3 ecosystem
          </p>
        </motion.div>

        {communityTweets.length > 0 ? (
          (() => {
            const cols = 3; // lg: 3 columns
            const chunkSize = Math.ceil(communityTweets.length / cols);
            const columns = Array.from({ length: cols }, (_, i) =>
              communityTweets.slice(i * chunkSize, (i + 1) * chunkSize)
            );
            return (
              <div className="flex flex-col md:flex-row gap-4 mt-4 h-fit relative">
                {columns.map((colTweets, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex flex-col gap-2 flex-1 min-w-0 max-h-[3000px]"
                  >
                    
                    {colTweets.map((tweet, index) => (
                      <motion.div
                        key={tweet.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.5,
                          delay: (colIndex * chunkSize + index) * 0.1,
                        }}
                        className="flex justify-center h-fit [&_.react-tweet-theme]:!my-2 [&_.react-tweet-theme]:!bg-surface/50 [&_.react-tweet-theme]:!border [&_.react-tweet-theme]:!border-white/5 [&_.react-tweet-theme]:!rounded-2xl [&_.react-tweet-theme]:!overflow-hidden"
                      >
                        <Tweet id={tweet.tweet_id} />
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })()
        ) : (
          <div className="mt-16 text-center py-16 rounded-2xl bg-surface/30 border border-white/5">
            <p className="text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
              Community love coming soon. Follow us on{" "}
              <a
                href="https://x.com/superteammy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:opacity-80 transition-opacity"
                aria-label="X (Twitter)"
              >
                <Image src="/icons/x.svg" alt="" width={20} height={20} className="shrink-0" />
              </a>{" "}
              to stay updated.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
