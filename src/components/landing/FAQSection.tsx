"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AccordionItem } from "@/components/ui/Accordion";
import { sampleFAQs } from "@/lib/data";

export function FAQSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#0D0D20]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about Superteam Malaysia"
          labelColor="green"
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-2xl bg-surface/30 border border-white/5 p-6 md:p-8"
        >
          {sampleFAQs.map((faq) => (
            <AccordionItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
