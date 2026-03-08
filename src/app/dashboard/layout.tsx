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
  X,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { href: "/dashboard/perks", label: "Perks", icon: Gift, badge: "WIP" },
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
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/admin");
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

  if (!isAuthenticated) return null;

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
              <Image src="/superteam.svg" alt="Superteam Malaysia" width={120} height={24} className="h-6 w-auto" />
            </Link>
          </div>

          <div className="px-5 mt-6">
            <h2 className="text-base font-semibold">My Dashboard</h2>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {sidebarLinks.map((link) => {
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
                  {link.badge && (
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-5 pt-4 border-t border-border/50 space-y-1">
            {(userRole === "super_admin" || userRole === "admin") && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                Admin Panel
              </Link>
            )}
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
