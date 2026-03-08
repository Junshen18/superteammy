"use client";

import { useState, useEffect } from "react";
import { Users, Calendar, Handshake, Mail, TrendingUp, UserPlus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardStats {
  totalMembers: number;
  onboardedMembers: number;
  pendingMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalPartners: number;
  invitesPending: number;
  invitesUsed: number;
}

export default function AdminDashboard() {
  const [userRole, setUserRole] = useState<UserRole>("member");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      const role: UserRole = (user?.app_metadata?.user_role as UserRole) || "member";
      setUserRole(role);

      const fetchPromises: Promise<unknown>[] = [
        supabase.from("profiles").select("id, onboarding_completed"),
        supabase.from("events").select("id, date").or("is_archived.is.null,is_archived.eq.false"),
        supabase.from("partners").select("id", { count: "exact", head: true }),
      ];
      if (role === "super_admin") {
        fetchPromises.push(supabase.from("invites").select("id, is_used, expires_at"));
      }

      const results = await Promise.all(fetchPromises);
      const profilesRes = results[0] as { data: { id: string; onboarding_completed?: boolean }[] | null };
      const eventsRes = results[1] as { data: { id: string; date: string }[] | null };
      const partnersRes = results[2] as { count: number | null };
      const invitesRes = role === "super_admin" ? (results[3] as { data: { is_used: boolean; expires_at: string }[] | null }) : { data: [] };

      const profiles = profilesRes.data || [];
      const events = eventsRes.data || [];
      const now = new Date();

      setStats({
        totalMembers: profiles.length,
        onboardedMembers: profiles.filter((p) => p.onboarding_completed).length,
        pendingMembers: profiles.filter((p) => !p.onboarding_completed).length,
        totalEvents: events.length,
        upcomingEvents: events.filter((e) => new Date(e.date) >= now).length,
        totalPartners: partnersRes.count ?? 0,
        invitesPending: (invitesRes.data || []).filter((i) => !i.is_used && new Date(i.expires_at) >= now).length,
        invitesUsed: (invitesRes.data || []).filter((i) => i.is_used).length,
      });
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading || !stats) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview and data analysis</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

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
            <p className="text-2xl font-bold">{stats.totalMembers}</p>
            <p className="text-xs text-muted-foreground mt-1">Members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <UserPlus className="w-5 h-5 text-green-500" />
            <span className="text-xs text-muted-foreground">Onboarded</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.onboardedMembers}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingMembers} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <span className="text-xs text-muted-foreground">Events</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalEvents}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.upcomingEvents} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Handshake className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">Partners</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalPartners}</p>
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
                  <p className="text-2xl font-bold">{stats.invitesPending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.invitesUsed}</p>
                  <p className="text-xs text-muted-foreground">Used</p>
                </div>
              </div>
              <Link
                href="/admin/members"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-2"
              >
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
              <Link href="/admin/members">
                <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
                  Members
                </span>
              </Link>
            )}
            <Link href="/admin/events">
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
                Events
              </span>
            </Link>
            <Link href="/admin/partners">
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
                Partners
              </span>
            </Link>
            <Link href="/admin/content">
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
