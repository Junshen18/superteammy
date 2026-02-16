"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";

interface ContentSection {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
}

const initialContent: ContentSection[] = [
  {
    key: "hero",
    label: "Hero Section",
    title: "Build the Future of Web3 in Malaysia",
    subtitle: "The Home for Solana Builders in Malaysia",
    description: "Superteam Malaysia connects builders, creators, and founders in the Solana ecosystem. Access grants, bounties, hackathons, and a global network of Web3 talent.",
  },
  {
    key: "mission",
    label: "Mission Section",
    title: "Empowering Malaysia's Web3 Builders",
    subtitle: "What We Do",
    description: "We provide the tools, community, and opportunities to help you build on Solana",
  },
  {
    key: "stats",
    label: "Stats Section",
    title: "Growing the Solana Ecosystem",
    subtitle: "Our Impact",
    description: "",
  },
  {
    key: "cta",
    label: "Call to Action",
    title: "Ready to Build with Us?",
    subtitle: "",
    description: "Join Superteam Malaysia and be part of the fastest-growing Solana community in Southeast Asia.",
  },
];

export default function AdminContentPage() {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState<string | null>(null);

  function handleUpdate(key: string, field: keyof ContentSection, value: string) {
    setContent(content.map((c) => (c.key === key ? { ...c, [field]: value } : c)));
  }

  function handleSave(key: string) {
    // In production, this would save to Supabase
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-white">Site Content</h1>
        <p className="text-sm text-muted mt-1">Edit landing page text content</p>
      </div>

      <div className="space-y-6">
        {content.map((section) => (
          <div key={section.key} className="p-6 rounded-xl bg-surface/50 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{section.label}</h3>
              <button
                onClick={() => handleSave(section.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  saved === section.key
                    ? "bg-solana-green/10 text-solana-green"
                    : "bg-white/5 text-muted hover:text-white hover:bg-white/10"
                }`}
              >
                {saved === section.key ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                {saved === section.key ? "Saved!" : "Save"}
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted-dark mb-1">Title</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdate(section.key, "title", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white text-sm focus:outline-none focus:border-solana-purple/30"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-dark mb-1">Subtitle</label>
                <input
                  type="text"
                  value={section.subtitle}
                  onChange={(e) => handleUpdate(section.key, "subtitle", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white text-sm focus:outline-none focus:border-solana-purple/30"
                />
              </div>
              {section.description && (
                <div>
                  <label className="block text-xs text-muted-dark mb-1">Description</label>
                  <textarea
                    value={section.description}
                    onChange={(e) => handleUpdate(section.key, "description", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white text-sm focus:outline-none focus:border-solana-purple/30 resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
