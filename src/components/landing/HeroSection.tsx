"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { useScramble } from "use-scramble";
import { useLoading } from "@/contexts/LoadingContext";

const heroNavLinks = [
  { href: "#about", label: "MISSIONS" },
  { href: "#impact", label: "IMPACTS" },
  { href: "#events", label: "EVENTS" },
  { href: "/members", label: "MEMBERS" },
  { href: "#ecosystem", label: "ECOSYSTEMS" },
  { href: "#community", label: "WALLOFLOVES" },
  { href: "#faq", label: "FAQ" },
];

function ScrambleLink({
  href,
  text,
  delay,
}: {
  href: string;
  text: string;
  delay: number;
}) {
  const [started, setStarted] = useState(false);
  const canReplayRef = useRef(true);
  const { ref, replay } = useScramble({
    text,
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

  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true);
      replay();
    }, delay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  const handleMouseEnter = () => {
    if (canReplayRef.current) {
      canReplayRef.current = false;
      replay();
    }
  };

  const handleMouseLeave = () => {
    canReplayRef.current = true;
  };

  return (
    <Link
      href={href}
      className="group flex items-center gap-1.5 transition-opacity duration-300 hover:text-solana-green"
      style={{ opacity: started ? 1 : 0 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="w-1 h-1 shrink-0 rounded-full bg-current opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden />
      <span ref={ref} className="pointer-events-none" />
    </Link>
  );
}

function getMalaysiaTime() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function CtaButton({
  href,
  text,
  external,
}: {
  href: string;
  text: string;
  external?: boolean;
}) {
  const canReplayRef = useRef(true);
  const { ref, replay } = useScramble({
    text,
    speed: 0.5,
    tick: 2,
    step: 1,
    scramble: 3,
    seed: 2,
    chance: 0.8,
    overdrive: false,
    overflow: false,
    playOnMount: true,
  });

  const handleMouseEnter = () => {
    if (canReplayRef.current) {
      canReplayRef.current = false;
      replay();
    }
  };

  const handleMouseLeave = () => {
    canReplayRef.current = true;
  };

  const baseClass =
    "group relative shrink-0 w-[145px] min-w-[145px] rounded-sm text-center overflow-hidden border border-white/40 px-5 py-2.5 font-[family-name:var(--font-orbitron)] text-sm tracking-widest text-white font-medium uppercase transition-colors duration-300 hover:border-white";

  const content = (
    <>
      <span
        className="absolute inset-0 z-0 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
        aria-hidden
      />
      <span
        ref={ref}
        className="relative z-10 pointer-events-none transition-colors duration-300 group-hover:text-black"
      />
    </>
  );

  if (external) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={baseClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </Link>
  );
}

function MalaysiaTime() {
  const [time, setTime] = useState(getMalaysiaTime);

  useEffect(() => {
    const interval = setInterval(() => setTime(getMalaysiaTime()), 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="font-[family-name:var(--font-orbitron)] tracking-wider text-white/70"
      style={{ fontSize: 12 }}
    >
      {time} (GMT+8)
    </span>
  );
}

export function HeroSection() {
  const { loading } = useLoading();
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (backgroundRef.current) {
            const scrollY = window.scrollY;
            backgroundRef.current.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { ref: headingRef, replay: replayHeading } = useScramble({
    text: "THE HOME OF SOLANA\nBUILDERS IN MALAYSIA",
    speed: 0.5,
    tick: 2,
    step: 2,
    scramble: 3,
    seed: 2,
    chance: 0.8,
    overdrive: false,
    overflow: false,
    playOnMount: false,
  });

  useEffect(() => {
    if (!loading) {
      replayHeading();
    }
  }, [loading, replayHeading]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col"
      style={{ zIndex: 0 }}
    >
      {/* Unicorn Studio Background — parallax layer */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <div
          data-us-project="4ICJyh1ZdclndHQ7640M"
          className="absolute inset-0 w-full h-full min-w-full min-h-full"
          style={{
            width: "100%",
            height: "100%",
            minWidth: "100%",
            minHeight: "100%",
          }}
        />
      </div>
      <Script id="unicorn-studio" strategy="afterInteractive">
        {`!function(){var u=window.UnicornStudio;if(u&&u.init){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",function(){u.init()})}else{u.init()}}else{window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js",i.onload=function(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",function(){UnicornStudio.init()})}else{UnicornStudio.init()}},(document.head||document.body).appendChild(i)}}();`}
      </Script>

      {/* Dark overlay - gradient from black 50% to transparent over bottom 30% */}
      <div
        className="absolute inset-0 pointer-events-none bg-size-[100%_30%] bg-bottom bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.5) 20%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen px-8 md:px-16 py-10 ">
        <div className="flex items-center justify-between w-full gap-4 pt-4">
          <div className="flex-1 min-w-0 h-px bg-white/20" />
          {/* Top: Logo centered */}
          <div className="flex items-center justify-center">
            <Image
              src="/superteam.svg"
              alt="Superteam Malaysia"
              width={154}
              height={18}
              className="h-5 w-auto"
              priority
            />
          </div>
          <div className="flex-1 min-w-0 h-px bg-white/20" />
        </div>


        {/* Middle row: Nav (left) | Logo + Heading (center) | Time (right) */}
        <div className="flex-1 flex items-center w-full">
          {/* Left: Nav links */}
          <nav
            className="hidden md:flex flex-col shrink-0 w-40 font-[family-name:var(--font-orbitron)] tracking-wider"
            style={{ fontSize: 12, color: "#e4e4e4", gap: 4 }}
          >
            {heroNavLinks.map((link, i) => (
              <ScrambleLink
                key={link.href}
                href={link.href}
                text={link.label}
                delay={1200 + i * 150}
              />
            ))}
          </nav>

          {/* Center: Logo + Heading */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 relative">
            <Image
              src="/white-stmy-logo.png"
              alt="Superteam Malaysia"
              width={120}
              height={120}
              className="w-[120px] h-auto absolute -top-[100%] "
              priority
            />
            <h2
              ref={headingRef}
              className="h-[120px] font-[family-name:var(--font-orbitron)] font-black text-2xl md:text-4xl lg:text-5xl text-white leading-tight whitespace-pre-line text-center transition-opacity duration-300"
              style={{ opacity: loading ? 0 : 1 }}
            />
          </div>

          {/* Right: Malaysia time */}
          <div className="hidden md:flex items-end justify-end shrink-0 w-40">
            <MalaysiaTime />
          </div>
        </div>


        {/* Bottom: CTA buttons + Subtitle */}
        <div className="flex items-center justify-between w-full gap-4">
          <CtaButton href="https://t.me/superteammy" text="CONNECT" external />
        <div className="flex-1 min-w-0 h-px bg-white/20" />


          <p className="hidden md:block w-2xl text-center text-base text-white/80 leading-relaxed uppercase font-inter font-medium">
            We connect local talent with global opportunities. Build, earn, and grow alongside Malaysia&apos;s most ambitious web3 community.
          </p>
        <div className="flex-1 min-w-0 h-px bg-white/20" />


          <CtaButton href="#about" text="EXPLORE" />
        </div>
      </div>
    </section>
  );
}
