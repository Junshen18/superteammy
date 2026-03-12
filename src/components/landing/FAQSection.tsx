"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AccordionItem } from "@/components/ui/Accordion";
import type { FAQ } from "@/lib/types";

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      id="faq"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        backgroundImage: "url(/images/faq-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase tracking-tight mb-12 text-left"
        >
          HAVE QUESTIONS THAT NEED ANSWER?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={index === 0}
              variant="card"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
