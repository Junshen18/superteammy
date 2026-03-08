"use client";

import { Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PerksPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Claim Perks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Exclusive perks for Superteam Malaysia members
        </p>
      </div>

      <Card className="border-amber-500/20">
        <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Gift className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white mb-1">Coming Soon</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              We&apos;re working on exclusive perks for community members including
              event tickets, merchandise, and partner benefits. Stay tuned!
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
            Work in Progress
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
