"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentSection {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
}

const initialContent: ContentSection[] = [
  { key: "hero", label: "Hero Section", title: "Build the Future of Web3 in Malaysia", subtitle: "The Home for Solana Builders in Malaysia", description: "Superteam Malaysia connects builders, creators, and founders in the Solana ecosystem. Access grants, bounties, hackathons, and a global network of Web3 talent." },
  { key: "mission", label: "Mission Section", title: "Empowering Malaysia's Web3 Builders", subtitle: "What We Do", description: "We provide the tools, community, and opportunities to help you build on Solana" },
  { key: "stats", label: "Stats Section", title: "Growing the Solana Ecosystem", subtitle: "Our Impact", description: "" },
  { key: "cta", label: "Call to Action", title: "Ready to Build with Us?", subtitle: "", description: "Join Superteam Malaysia and be part of the fastest-growing Solana community in Southeast Asia." },
];

export function AdminContentClient() {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState<string | null>(null);

  function handleUpdate(key: string, field: keyof ContentSection, value: string) {
    setContent(content.map((c) => (c.key === key ? { ...c, [field]: value } : c)));
  }

  function handleSave(key: string) {
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Site Content</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit landing page text content</p>
      </div>

      <div className="space-y-6">
        {content.map((section) => (
          <Card key={section.key}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{section.label}</CardTitle>
              <Button variant={saved === section.key ? "secondary" : "outline"} size="sm" onClick={() => handleSave(section.key)} disabled={saved === section.key}>
                {saved === section.key ? <Check className="w-3 h-3 mr-2" /> : <Save className="w-3 h-3 mr-2" />}
                {saved === section.key ? "Saved!" : "Save"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={section.title} onChange={(e) => handleUpdate(section.key, "title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={section.subtitle} onChange={(e) => handleUpdate(section.key, "subtitle", e.target.value)} />
              </div>
              {section.description !== undefined && (
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea value={section.description} onChange={(e) => handleUpdate(section.key, "description", e.target.value)} rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
