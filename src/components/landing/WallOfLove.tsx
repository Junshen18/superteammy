"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Twitter, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sampleTestimonials } from "@/lib/data";

export function WallOfLove() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="community" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Community"
          title="Wall of Love"
          subtitle="Hear from builders and leaders in the Malaysian Web3 ecosystem"
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {sampleTestimonials.map((testimonial, index) => (
            <motion.a
              key={testimonial.id}
              href={testimonial.tweet_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group block p-6 rounded-2xl bg-surface/50 border border-white/5 hover:border-solana-purple/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-8 h-8 text-solana-purple/30" />
                <Twitter className="w-5 h-5 text-muted group-hover:text-[#1DA1F2] transition-colors" />
              </div>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solana-purple to-solana-green p-0.5">
                  <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {testimonial.author_name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {testimonial.author_name}
                  </p>
                  <p className="text-xs text-muted-dark">
                    {testimonial.author_handle}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
