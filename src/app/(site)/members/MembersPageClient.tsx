"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MemberCard } from "@/components/members/MemberCard";
import { MemberFilters } from "@/components/members/MemberFilters";
import type { Member } from "@/lib/types";

interface MembersPageClientProps {
  members: Member[];
}

export function MembersPageClient({ members }: MembersPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Core Team" && member.is_core_team) ||
        member.skill_tags.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [members, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-solana-purple mb-4">
            Our Community
          </p>
          <h1 className="font-[family-name:var(--font-orbitron)] text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Member Directory
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Discover the talented builders, creators, and founders driving the
            Solana ecosystem in Malaysia
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <MemberFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-sm text-muted-dark mb-6"
        >
          Showing {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}
        </motion.p>

        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted mb-2">No members found</p>
            <p className="text-sm text-muted-dark">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
