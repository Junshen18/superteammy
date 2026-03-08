"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Twitter, Github, Linkedin, Globe } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import type { Profile } from "@/lib/types";

interface MembersSpotlightProps {
  profiles: Profile[];
}

export function MembersSpotlight({ profiles }: MembersSpotlightProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const featured = profiles.slice(0, 4);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Our Builders"
          title="Member Spotlight"
          subtitle="Meet the talented builders driving the Solana ecosystem in Malaysia"
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {featured.map((profile, index) => {
            const displayName = profile.nickname || profile.real_name || "Member";
            const isCoreTeam = profile.user_role === "admin" || profile.user_role === "super_admin";
            const primaryRole = (profile.roles || [])[0]?.name;
            const primaryCompany = (profile.companies || [])[0]?.name;

            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl bg-surface/50 border border-white/5 hover:border-solana-purple/20 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-solana-purple to-solana-green p-0.5 mb-4">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-semibold text-white mb-1">
                  {displayName}
                </h3>
                {primaryRole && <p className="text-sm text-muted-dark mb-1">{primaryRole}</p>}
                {primaryCompany && <p className="text-sm text-solana-purple mb-4">{primaryCompany}</p>}

                {(profile.skills || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {profile.skills!.slice(0, 3).map((skill) => (
                      <Badge key={skill.id} variant="default">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {profile.twitter_url && (
                    <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-solana-purple transition-colors">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-solana-purple transition-colors">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-solana-purple transition-colors">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-solana-purple transition-colors">
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {isCoreTeam && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="purple">Core Team</Badge>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border border-white/10 hover:bg-white/5 transition-all"
          >
            View All Members
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
