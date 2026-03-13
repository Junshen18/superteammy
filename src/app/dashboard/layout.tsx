"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  FolderOpen,
  Gift,
  LogOut,
  Menu,
  ArrowLeft,
  LayoutDashboard,
  Users,
  Calendar,
  Handshake,
  FileText,
  Mail,
  PanelLeftClose,
  PanelLeft,
  BarChart3,
  Heart,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const sidebarLinks: { href: string; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/perks", label: "Perks", icon: Gift },
];

const adminLinks = [
  { href: "/dashboard/members", label: "Members", icon: Users, roles: ["super_admin"] as const },
  { href: "/dashboard/events", label: "Events", icon: Calendar, roles: ["super_admin", "admin"] as const },
  { href: "/dashboard/partners", label: "Partners", icon: Handshake, roles: ["super_admin", "admin"] as const },
  { href: "/dashboard/community", label: "Community", icon: Heart, roles: ["super_admin", "admin"] as const },
  { href: "/dashboard/manage-perks", label: "Perks", icon: Gift, roles: ["super_admin", "admin"] as const },
  { href: "/dashboard/content", label: "Site Content", icon: FileText, roles: ["super_admin", "admin"] as const },
  { href: "/dashboard/metrics", label: "Dashboard Metrics", icon: BarChart3, roles: ["super_admin", "admin"] as const },
  { href: "/dashboard/invites", label: "Invites", icon: Mail, roles: ["super_admin"] as const },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-sidebar-collapsed");
    if (stored !== null) setSidebarCollapsed(stored === "true");
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed, user_role")
      .eq("id", user.id)
      .single();

    if (!profile?.onboarding_completed) {
      router.push("/onboarding");
      return;
    }

    setUserRole(profile.user_role);
    setIsAuthenticated(true);
    setIsLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed, user_role")
        .eq("id", data.user!.id)
        .single();

      if (!profile?.onboarding_completed) {
        router.push("/onboarding");
        return;
      }

      setUserRole(profile.user_role);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

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
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
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
              {loginError && <p className="text-sm text-destructive">{loginError}</p>}
              <Button type="submit" className="w-full cursor-pointer">Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen" style={{ backgroundColor: "#080B0E" }}>
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 right-4 z-50 md:hidden p-2 rounded-lg bg-card border"
        >
          <Menu size={20} />
        </button>
      )}

      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          className="fixed inset-0 z-30 md:hidden bg-black/50 backdrop-blur-sm"
        />
      )}

      <div className="flex">
        <aside
          className={cn(
            "fixed md:sticky top-0 left-0 h-screen bg-card border-r flex flex-col overflow-y-auto transition-all duration-300 z-40",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            "w-64 md:w-64",
            sidebarCollapsed && "md:w-16"
          )}
        >
          <div className={cn("pt-6 shrink-0", sidebarCollapsed ? "md:px-0 md:flex md:justify-center" : "px-5")}>
            <Link href="/" className={cn("block", sidebarCollapsed && "md:w-10 md:h-10 md:flex md:items-center md:justify-center")}>
              <Image
                src="/white-stmy-logo.png"
                alt="Superteam Malaysia"
                width={40}
                height={40}
                className={cn("h-6 w-6 object-contain", "hidden", sidebarCollapsed && "md:block")}
              />
              <Image
                src="/superteam.svg"
                alt="Superteam Malaysia"
                width={120}
                height={24}
                className={cn("h-4 w-auto md:h-6", sidebarCollapsed && "md:hidden")}
              />
            </Link>
          </div>

          <div className={cn("px-5 mt-6", sidebarCollapsed && "md:px-0 md:mt-4 md:overflow-hidden")}>
            <h2 className={cn("text-base font-semibold", sidebarCollapsed && "md:sr-only")}>My Dashboard</h2>
          </div>

          <nav className="flex-1 px-3 py-3 space-y-0.5">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? link.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    sidebarCollapsed && "md:justify-center md:px-4",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <link.icon className="w-4 h-4 shrink-0" />
                  <span className={cn(sidebarCollapsed && "md:hidden")}>{link.label}</span>
                  {link.badge && !sidebarCollapsed && (
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            {(userRole === "super_admin" || userRole === "admin") && (
              <>
                <div className={cn("px-3 py-2 mt-4", sidebarCollapsed && "md:px-0 md:mt-2")}>
                  <p className={cn("text-xs font-medium text-muted-foreground uppercase tracking-wider", sidebarCollapsed && "md:sr-only")}>Admin</p>
                </div>
                {adminLinks
                  .filter((link) => userRole && (link.roles as readonly string[]).includes(userRole))
                  .map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        title={sidebarCollapsed ? link.label : undefined}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          sidebarCollapsed && "md:justify-center md:px-4",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <link.icon className="w-4 h-4 shrink-0" />
                        <span className={cn(sidebarCollapsed && "md:hidden")}>{link.label}</span>
                      </Link>
                    );
                  })}
              </>
            )}
          </nav>

          <div className={cn("p-3 border-t border-border/50 space-y-1", sidebarCollapsed && "md:p-3 md:pt-3")}>
            <button
              type="button"
              onClick={() => {
                setSidebarCollapsed(!sidebarCollapsed);
                if (typeof window !== "undefined") {
                  localStorage.setItem("dashboard-sidebar-collapsed", String(!sidebarCollapsed));
                }
              }}
              className={cn(
                "hidden md:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full cursor-pointer",
                sidebarCollapsed && "md:justify-center md:px-0"
              )}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4 shrink-0" /> : <PanelLeftClose className="w-4 h-4 shrink-0" />}
              <span className={cn(sidebarCollapsed && "md:hidden")}>{sidebarCollapsed ? "Expand" : "Collapse"}</span>
            </button>
            {(userRole === "super_admin" || userRole === "admin") && (
              <Link
                href="/dashboard"
                title={sidebarCollapsed ? "Admin Panel" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                  sidebarCollapsed && "md:justify-center md:px-4"
                )}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className={cn(sidebarCollapsed && "md:hidden")}>Admin Panel</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full justify-start transition-colors cursor-pointer",
                sidebarCollapsed && "md:justify-center md:px-4"
              )}
              title={sidebarCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className={cn(sidebarCollapsed && "md:hidden")}>Sign Out</span>
            </button>
            <Link
              href="/"
              title={sidebarCollapsed ? "Back to site" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                sidebarCollapsed && "md:justify-center md:px-4"
              )}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className={cn(sidebarCollapsed && "md:hidden")}>Back to site</span>
            </Link>
          </div>
        </aside>

        <main
          className="flex-1 min-h-screen p-6 md:p-8 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/perks-bg.png)",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
