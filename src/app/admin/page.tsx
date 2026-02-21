"use client";

import { Users, Calendar, Handshake, BarChart3 } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Members", value: "6", icon: Users, href: "/admin/members", color: "text-solana-purple" },
  { label: "Events", value: "4", icon: Calendar, href: "/admin/events", color: "text-solana-green" },
  { label: "Partners", value: "8", icon: Handshake, href: "/admin/partners", color: "text-accent-gold" },
  { label: "Content Sections", value: "10", icon: BarChart3, href: "/admin/content", color: "text-solana-purple" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-orbitron)] text-2xl font-bold text-white">
          Dashboard
        </h1>
        <p className="text-sm text-muted mt-1">
          Welcome to the Superteam Malaysia admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-6 rounded-xl bg-surface/50 border border-white/5 hover:border-solana-purple/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-muted-dark group-hover:text-white transition-colors">
                Manage &rarr;
              </span>
            </div>
            <p className="font-[family-name:var(--font-orbitron)] text-3xl font-bold text-white mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-xl bg-surface/50 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/members"
            className="px-4 py-3 rounded-lg bg-solana-purple/10 text-solana-purple text-sm font-medium hover:bg-solana-purple/15 transition-colors"
          >
            + Add New Member
          </Link>
          <Link
            href="/admin/events"
            className="px-4 py-3 rounded-lg bg-solana-green/10 text-solana-green text-sm font-medium hover:bg-solana-green/15 transition-colors"
          >
            + Create Event
          </Link>
          <Link
            href="/admin/partners"
            className="px-4 py-3 rounded-lg bg-accent-gold/10 text-accent-gold text-sm font-medium hover:bg-accent-gold/15 transition-colors"
          >
            + Add Partner
          </Link>
          <Link
            href="/admin/content"
            className="px-4 py-3 rounded-lg bg-white/5 text-muted text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Edit Site Content
          </Link>
        </div>
      </div>
    </div>
  );
}
