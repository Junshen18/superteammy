"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Handshake,
  FileText,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ArrowLeft,
  User,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const sidebarLinks: SidebarLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["super_admin", "admin"] },
  { href: "/admin/members", label: "Members", icon: Users, roles: ["super_admin"] },
  { href: "/admin/events", label: "Events", icon: Calendar, roles: ["super_admin", "admin"] },
  { href: "/admin/partners", label: "Partners", icon: Handshake, roles: ["super_admin", "admin"] },
  { href: "/admin/content", label: "Site Content", icon: FileText, roles: ["super_admin", "admin"] },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("member");

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const role = (user.app_metadata?.user_role as UserRole) || "member";
      setUserRole(role);

      if (role !== "super_admin" && role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const role = (data.user?.app_metadata?.user_role as UserRole) || "member";
      setUserRole(role);

      if (role !== "super_admin" && role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setIsAuthenticated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserRole("member");
  }

  const visibleLinks = sidebarLinks.filter((link) => link.roles.includes(userRole));

  if (isLoading) {
    return (
      <div className="dark min-h-screen flex items-center justify-center" style={{ backgroundColor: "#080B0E" }}>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="dark min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#080B0E" }}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to manage Superteam Malaysia content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen" style={{ backgroundColor: "#080B0E" }}>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card border"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex">
        <aside
          className={cn(
            "fixed md:sticky top-0 left-0 h-screen w-64 bg-card border-r flex flex-col overflow-y-auto transition-transform z-40",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="pt-6 px-5">
            <Link href="/" className="block">
              <Image
                src="/superteam.svg"
                alt="Superteam Malaysia"
                width={120}
                height={24}
                className="h-6 w-auto"
              />
            </Link>
          </div>

          <div className="px-5 mt-6">
            <h2 className="text-base font-semibold">Admin console</h2>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
              {userRole.replace("_", " ")}
            </p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <link.icon className="w-4 h-4 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-5 pt-4 border-t border-border/50 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <User className="w-4 h-4 shrink-0" />
              My Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full justify-start transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              Back to site
            </Link>
          </div>
        </aside>

        <main className="flex-1 min-h-screen p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
