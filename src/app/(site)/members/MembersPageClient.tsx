"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MemberProfileCard } from "@/components/members/MemberProfileCard";
import { MemberFilters } from "@/components/members/MemberFilters";
import type { Profile, LookupTag } from "@/lib/types";

interface MembersPageClientProps {
  profiles: Profile[];
  availableSkills: LookupTag[];
}

export function MembersPageClient({ profiles, availableSkills }: MembersPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = useMemo(() => {
    const skillNames = availableSkills.map((s) => s.name);
    return ["All", "Core Team", ...skillNames];
  }, [availableSkills]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const displayName = profile.nickname || profile.real_name || "";
      const roleNames = (profile.roles || []).map((r) => r.name).join(" ");
      const companyNames = (profile.companies || []).map((c) => c.name).join(" ");

      const matchesSearch =
        searchQuery === "" ||
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        companyNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roleNames.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Core Team" && (profile.user_role === "admin" || profile.user_role === "super_admin")) ||
        (profile.skills || []).some((s) => s.name === activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [profiles, searchQuery, activeFilter]);

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
            filterOptions={filterOptions}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-sm text-muted-dark mb-6"
        >
          Showing {filteredProfiles.length} member{filteredProfiles.length !== 1 ? "s" : ""}
        </motion.p>

        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredProfiles.map((profile, index) => (
              <MemberProfileCard key={profile.id} profile={profile} index={index} />
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
