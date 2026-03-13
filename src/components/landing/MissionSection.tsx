"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    title: "LEARN",
    image: "/images/learn.jpeg",
    description:
      "Learn through hands-on education, workshops, and mentorship from experienced builders across the ecosystem.",
  },
  {
    title: "BUILD",
    image: "/images/build.jpeg",
    description:
      "Build alongside the community through hackathons, collaborative events, and real projects that turn ideas into production-ready products.",
  },
  {
    title: "GROW",
    image: "/images/grow.jpeg",
    description:
      "Grow your career and network through strong ecosystem connections and long-term opportunities, locally and globally.",
  },
  {
    title: "EARN",
    image: "/images/earn.jpeg",
    description:
      "Earn through grants, funding access, jobs, and bounties by contributing to impactful Web3 projects.",
  },
];

const COLLAPSED_WIDTH = 200;
const EXPANDED_MIN_WIDTH = 420;

export function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const pillarsContainerRef = useRef<HTMLDivElement>(null);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [titleRevealed, setTitleRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const container = pillarsContainerRef.current;
    const pillarsEl = pillarRefs.current.filter(Boolean);
    const descEl = descRefs.current.filter(Boolean);
    const labelEl = labelRefs.current.filter(Boolean);

    if (!section || !container || pillarsEl.length === 0) return;

    // Only run GSAP animations on laptop (xl breakpoint: 1280px+)
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    if (!mediaQuery.matches) return;

    let handleWheel: (e: WheelEvent) => void;
    let ctx: gsap.Context | null = null;

    const cleanup = () => {
      window.removeEventListener("wheel", handleWheel);
      ctx?.revert();
    };

    const onResize = () => {
      if (!mediaQuery.matches) cleanup();
    };
    mediaQuery.addEventListener("change", onResize);

    ctx = gsap.context(() => {
      // Set initial state: visible, collapsed
      pillarsEl.forEach((el) => {
        gsap.set(el, { width: COLLAPSED_WIDTH, minWidth: COLLAPSED_WIDTH });
      });
      descEl.forEach((el) => {
        gsap.set(el, { width: 0, minWidth: 0, flex: "0 0 0", overflow: "hidden", opacity: 0 });
      });
      labelEl.forEach((el) => {
        gsap.set(el, { left: "50%", xPercent: -50 });
      });

      let step = 0;
      let scrollAccum = 0;
      const SCROLL_THRESHOLD = 160;

      const applyStep = (newStep: number) => {
        const expandDuration = 0.4;
        const collapseDuration = 0.3;

        pillarsEl.forEach((el, i) => {
          const shouldExpand = i === newStep - 1;
          gsap.to(el, {
            width: shouldExpand ? "auto" : COLLAPSED_WIDTH,
            minWidth: shouldExpand ? EXPANDED_MIN_WIDTH : COLLAPSED_WIDTH,
            flex: shouldExpand ? "1 1 420px" : `0 0 ${COLLAPSED_WIDTH}px`,
            duration: shouldExpand ? expandDuration : collapseDuration,
            ease: "power2.out",
          });
          if (descEl[i]) {
            gsap.to(descEl[i], {
              width: shouldExpand ? "auto" : 0,
              minWidth: 0,
              flex: shouldExpand ? "1 1 0" : "0 0 0",
              overflow: shouldExpand ? "visible" : "hidden",
              opacity: shouldExpand ? 1 : 0,
              duration: shouldExpand ? expandDuration : collapseDuration,
              ease: "power2.out",
            });
          }
            if (labelEl[i]) {
            gsap.to(labelEl[i], {
              left: shouldExpand ? 32 : "50%",
              xPercent: shouldExpand ? 0 : -50,
              duration: shouldExpand ? expandDuration : collapseDuration,
              ease: "power2.out",
            });
          }
        });
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=80%",
        pin: true,
        scrub: false,
      });

      handleWheel = (e: WheelEvent) => {
        if (!st.isActive) return;

        scrollAccum += e.deltaY;
        if (scrollAccum > SCROLL_THRESHOLD) {
          scrollAccum = 0;
          step = Math.min(5, step + 1);
          if (step <= 4) {
            e.preventDefault();
            applyStep(step);
          }
          // step === 5: allow scroll through (don't preventDefault)
        } else if (scrollAccum < -SCROLL_THRESHOLD) {
          scrollAccum = 0;
          step = Math.max(0, step - 1);
          e.preventDefault();
          applyStep(step);
        } else {
          // Small scroll: only prevent when we're controlling pillars (step < 5)
          if (step < 5) e.preventDefault();
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
    }, section);

    return () => {
      mediaQuery.removeEventListener("change", onResize);
      cleanup();
    };
  }, []);

  // Trigger title scramble when section enters view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      onEnter: () => setTitleRevealed(true),
      once: true,
    });

    return () => st.kill();
  }, []);

  return (
    <section
      id="missions"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-visible xl:pb-12"
    >
      {/* Background - Next.js Image auto-serves WebP when supported */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/mission-bg.png"
          alt=""
          fill
          className="object-cover object-center"
          unoptimized
          priority={false}
        />
      </div>
      {/* Centered heading */}
      <div
        ref={headingRef}
        className="relative z-10 text-center px-6 py-7 md:py-10 mt-6"
      >
        <h2 className="font-[family-name:var(--font-orbitron)] text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight max-w-5xl mx-auto flex flex-col items-center justify-center gap-0">
          {(["Empowering Malaysia's", "Solana Builders"] as const).map((line, i) => (
            <div key={i} className="overflow-hidden" style={{ lineHeight: 1.25 }}>
              <motion.span
                className="block text-center will-change-transform"
                style={{ lineHeight: 1.25 }}
                initial={{ y: 60 }}
                animate={titleRevealed ? { y: 0 } : { y: 60 }}
                transition={{
                  duration: 0.9,
                  ease: [0.77, 0, 0.175, 1],
                  delay: titleRevealed ? i * 0.1 : 0,
                }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </h2>
      </div>

      {/* Mobile: vertical stack of cards */}
      <div className="relative z-10 flex md:hidden flex-col gap-6 px-6 pb-16">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 80 }}
            animate={titleRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative h-[280px] overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0">
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
              <h3 className="font-[family-name:var(--font-orbitron)] font-black text-white text-3xl mb-1 drop-shadow-lg">
                {pillar.title}
              </h3>
              <p className="text-white/90 text-[12px] ">
                {pillar.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tablet: 2x2 grid (768px - 1279px) */}
      <div className="relative z-10 hidden md:grid xl:hidden grid-cols-2 gap-6 px-6 pb-16">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 80 }}
            animate={titleRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative h-[280px] overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0">
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                className="object-cover object-center"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
              <h3 className="font-[family-name:var(--font-orbitron)] font-black text-white text-3xl mb-1 drop-shadow-lg">
                {pillar.title}
              </h3>
              <p className="text-white/90 text-[12px] ">
                {pillar.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: 4 pillars - horizontal row, centered (1280px+) */}
      <div
        ref={pillarsContainerRef}
        className="relative z-10 hidden xl:flex w-full overflow-visible justify-center items-center gap-12 min-h-[550px] px-6 md:px-10"
      >
        {pillars.map((pillar, i) => (
          <div
            key={pillar.title}
            ref={(el) => {
              pillarRefs.current[i] = el;
            }}
            className="relative w-[200px] min-w-[200px] h-[600px] overflow-hidden rounded-xl"
          >
            {/* Image */}
            <div className="absolute inset-0">
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 25vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Title + content in flex-row */}
            <div className="absolute inset-0 flex flex-row items-stretch z-10">
              {/* Title (rotated 90°) - centered in pillar when collapsed */}
              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shrink-0 min-h-[600px] w-fit"
              >
                <span
                  className="font-[family-name:var(--font-orbitron)] font-black text-[80px] xl:text-[120px] text-white drop-shadow-lg origin-center whitespace-nowrap"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {pillar.title}
                </span>
              </div>

              {/* Description - only displays when pillar expands */}
              <div
                ref={(el) => {
                  descRefs.current[i] = el;
                }}
                className="flex items-end px-12 pb-8 xl:px-12 xl:pb-12 xl:pl-52 overflow-hidden"
                style={{ flex: "0 0 0", width: 0, minWidth: 0, opacity: 0 }}
              >
                <p className="md:text-base xl:text-2xl text-white/90 ">
                  {pillar.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
