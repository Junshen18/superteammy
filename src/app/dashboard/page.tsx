"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, FolderOpen, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) setProfile(profileData as Profile);

    const { count } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id);

    setProjectCount(count ?? 0);
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {profile.nickname || "Member"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s your dashboard overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link href="/dashboard/profile">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <User className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">Edit →</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Profile</p>
              <p className="text-sm text-muted-foreground mt-1">
                {profile.bio ? "Complete" : "Add a bio"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/projects">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <FolderOpen className="w-5 h-5 text-green-500" />
              <span className="text-xs text-muted-foreground">Manage →</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{projectCount}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {projectCount === 1 ? "Project" : "Projects"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500">
              WIP
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Perks</p>
            <p className="text-sm text-muted-foreground mt-1">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Nickname</p>
              <p className="text-white font-medium">{profile.nickname || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Real Name</p>
              <p className="text-white font-medium">{profile.real_name || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Role</p>
              <p className="text-white font-medium capitalize">{profile.user_role.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Member Since</p>
              <p className="text-white font-medium">
                {new Date(profile.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild className="cursor-pointer">
              <Link href="/dashboard/profile">
                <Pencil className="w-4 h-4 mr-2" /> Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
