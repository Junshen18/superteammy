"use client";

import { motion } from "framer-motion";
import { Twitter, Linkedin, Send, Link2 } from "lucide-react";
import { SuperteamLogo } from "@/components/ui/SuperteamLogo";
import type { Profile } from "@/lib/types";

interface MemberProfileCardProps {
  profile: Profile;
  index?: number;
}

/** Small Malaysian flag SVG (Jalur Gemilang) for member cards */
function MalaysiaFlag({ className }: { className?: string }) {
  const stripeH = 16 / 14;
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden>
      {/* 14 alternating red and white stripes */}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={i * stripeH}
          width="24"
          height={stripeH + 0.1}
          fill={i % 2 === 0 ? "#C00" : "#fff"}
        />
      ))}
      {/* Blue canton (top-left quarter) */}
      <rect width="12" height="8" fill="#010066" />
      {/* Yellow 14-point star (simplified as circle for small size) */}
      <circle cx="6" cy="4" r="2" fill="#FC0" />
    </svg>
  );
}

export function MemberProfileCard({ profile, index = 0 }: MemberProfileCardProps) {
  const displayName = (profile.nickname || profile.real_name || "Member").toUpperCase();
  const primaryRole = (profile.roles || [])[0]?.name;
  const primaryCompany = (profile.companies || [])[0]?.name;
  const profession = [primaryCompany, primaryRole].filter(Boolean).join(" ") || "Member";
  const memberNum = profile.member_number ?? null;
  const formattedMemberNum = memberNum != null ? `#${String(memberNum).padStart(3, "0")}` : null;

  const hasAnyLink =
    profile.twitter_url || profile.linkedin_url || profile.telegram_url || profile.website_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative w-full max-w-[320px] rounded-2xl overflow-hidden border border-white/10 shadow-xl"
      style={{
        background:
          "linear-gradient(180deg, #2a1f1a 0%, #1a1412 50%, #151010 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative p-5 flex flex-col items-center">
        {/* Header: logo + flag + member number */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SuperteamLogo className="w-6 h-5" color="white" animated={false} />
            <span className="text-white font-semibold text-sm tracking-wide lowercase">
              superteam
            </span>
            <MalaysiaFlag className="w-5 h-3.5 shrink-0" />
          </div>
          {formattedMemberNum && (
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-white border border-white/20"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              {formattedMemberNum}
            </span>
          )}
        </div>

        {/* Separator */}
        <div className="w-full flex justify-center mb-4">
          <div className="relative h-0.5 w-full max-w-[200px] bg-white/20 rounded-full">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-sm bg-amber-700/80"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.2)" }}
            />
          </div>
        </div>

        {/* Avatar area with role badge */}
        <div className="relative w-full flex flex-col items-center mb-4">
          {primaryRole && (
            <span
              className="mb-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/90 border border-amber-800/50"
              style={{ backgroundColor: "rgba(180,140,100,0.25)" }}
            >
              {primaryRole}
            </span>
          )}
          <div
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10"
            style={{
              backgroundColor: "rgba(60,55,50,0.6)",
              backgroundImage: `
                linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%)
              `,
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
            }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-solana-purple/20 to-solana-green/20">
                <span className="text-2xl font-bold text-white/80">
                  {displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-1 text-center">
          {displayName}
        </h3>
        {/* Profession */}
        <p className="text-xs text-white/80 uppercase tracking-wider text-center mb-4">
          {profession}
        </p>

        {/* Separator */}
        <div className="w-full flex justify-center mb-4">
          <div className="relative h-0.5 w-full max-w-[200px] bg-white/20 rounded-full">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-sm bg-amber-700/80"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.2)" }}
            />
          </div>
        </div>

        {/* Social links */}
        {hasAnyLink && (
          <div className="flex items-center justify-center gap-4">
            {profile.twitter_url && (
              <a
                href={profile.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.telegram_url && (
              <a
                href={profile.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            )}
            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Portfolio"
              >
                <Link2 className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
