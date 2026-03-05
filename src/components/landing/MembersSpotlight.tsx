"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Twitter, Trophy, Code2, Award } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import type { Member } from "@/lib/types";

interface MembersSpotlightProps {
  members: Member[];
}

export function MembersSpotlight({ members }: MembersSpotlightProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const featuredMembers = members.slice(0, 4);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Our Builders"
          title="Member Spotlight"
          subtitle="Meet the talented builders driving the Solana ecosystem in Malaysia"
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {featuredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-surface/50 border border-white/5 hover:border-solana-purple/20 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-solana-purple to-solana-green p-0.5 mb-4">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-base font-semibold text-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-muted-dark mb-1">{member.role}</p>
              <p className="text-sm text-solana-purple mb-4">{member.company}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {member.skill_tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Achievements */}
              <div className="space-y-2 mb-4">
                {member.achievements.hackathon_wins && (
                  <div className="flex items-center gap-2 text-xs text-muted-dark">
                    <Trophy className="w-3 h-3 text-accent-gold" />
                    <span>{member.achievements.hackathon_wins} hackathon wins</span>
                  </div>
                )}
                {member.achievements.projects_built && (
                  <div className="flex items-center gap-2 text-xs text-muted-dark">
                    <Code2 className="w-3 h-3 text-solana-green" />
                    <span>{member.achievements.projects_built} projects built</span>
                  </div>
                )}
                {member.achievements.bounties_completed && (
                  <div className="flex items-center gap-2 text-xs text-muted-dark">
                    <Award className="w-3 h-3 text-solana-purple" />
                    <span>{member.achievements.bounties_completed} bounties</span>
                  </div>
                )}
              </div>

              {/* Twitter Link */}
              <a
                href={member.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-solana-purple transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Follow on X</span>
              </a>

              {/* Core Team Badge */}
              {member.is_core_team && (
                <div className="absolute top-4 right-4">
                  <Badge variant="purple">Core Team</Badge>
                </div>
              )}
            </motion.div>
          ))}
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
