"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, FolderOpen, Pencil, Users, Calendar, Handshake, Mail, TrendingUp, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminStats {
  totalMembers: number;
  onboardedMembers: number;
  pendingMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalPartners: number;
  invitesPending: number;
  invitesUsed: number;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [userRole, setUserRole] = useState<UserRole>("member");
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const role: UserRole = (user?.app_metadata?.user_role as UserRole) || "member";
    setUserRole(role);

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

    if (role === "super_admin" || role === "admin") {
      const fetchPromises = [
        supabase.from("profiles").select("id, onboarding_completed"),
        supabase.from("events").select("id, date").or("is_archived.is.null,is_archived.eq.false"),
        supabase.from("partners").select("id", { count: "exact", head: true }),
      ] as const;
      const extraPromises = role === "super_admin"
        ? [supabase.from("invites").select("id, is_used, expires_at")]
        : [];
      const results = await Promise.all([...fetchPromises, ...extraPromises]);
      const profilesRes = results[0] as { data: { id: string; onboarding_completed?: boolean }[] | null };
      const eventsRes = results[1] as { data: { id: string; date: string }[] | null };
      const partnersRes = results[2] as { count: number | null };
      const invitesRes = role === "super_admin" ? (results[3] as { data: { is_used: boolean; expires_at: string }[] | null }) : { data: [] };
      const profiles = profilesRes.data || [];
      const events = eventsRes.data || [];
      const now = new Date();
      setAdminStats({
        totalMembers: profiles.length,
        onboardedMembers: profiles.filter((p) => p.onboarding_completed).length,
        pendingMembers: profiles.filter((p) => !p.onboarding_completed).length,
        totalEvents: events.length,
        upcomingEvents: events.filter((e) => new Date(e.date) >= now).length,
        totalPartners: partnersRes.count ?? 0,
        invitesPending: (invitesRes.data || []).filter((i) => !i.is_used && new Date(i.expires_at) >= now).length,
        invitesUsed: (invitesRes.data || []).filter((i) => i.is_used).length,
      });
    }
  }

  const isAdmin = userRole === "super_admin" || userRole === "admin";

  if (isAdmin && adminStats) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview and data analysis</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">Total</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{adminStats.totalMembers}</p>
              <p className="text-xs text-muted-foreground mt-1">Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <UserPlus className="w-5 h-5 text-green-500" />
              <span className="text-xs text-muted-foreground">Onboarded</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{adminStats.onboardedMembers}</p>
              <p className="text-xs text-muted-foreground mt-1">{adminStats.pendingMembers} pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span className="text-xs text-muted-foreground">Events</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{adminStats.totalEvents}</p>
              <p className="text-xs text-muted-foreground mt-1">{adminStats.upcomingEvents} upcoming</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Handshake className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground">Partners</span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{adminStats.totalPartners}</p>
            </CardContent>
          </Card>
          {userRole === "super_admin" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-muted-foreground">Invites</span>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div>
                    <p className="text-2xl font-bold">{adminStats.invitesPending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{adminStats.invitesUsed}</p>
                    <p className="text-xs text-muted-foreground">Used</p>
                  </div>
                </div>
                <Link href="/dashboard/members" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-2">
                  Generate invite →
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Navigation
            </CardTitle>
            <CardDescription>Jump to management sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userRole === "super_admin" && (
                <Link href="/dashboard/members">
                  <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
                    Members
                  </span>
                </Link>
              )}
              <Link href="/dashboard/events">
                <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
                  Events
                </span>
              </Link>
              <Link href="/dashboard/partners">
                <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
                  Partners
                </span>
              </Link>
              <Link href="/dashboard/content">
                <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
                  Site Content
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
