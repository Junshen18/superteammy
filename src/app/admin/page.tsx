"use client";

import { Users, Calendar, Handshake, BarChart3 } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Members", icon: Users, href: "/admin/members", color: "text-primary" },
  { label: "Events", icon: Calendar, href: "/admin/events", color: "text-green-500" },
  { label: "Partners", icon: Handshake, href: "/admin/partners", color: "text-amber-500" },
  { label: "Content", icon: BarChart3, href: "/admin/content", color: "text-primary" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the Superteam Malaysia admin panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">Manage →</span>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your website content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin/members">+ Add Member</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/events">+ Create Event</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/partners">+ Add Partner</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/content">Edit Site Content</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
