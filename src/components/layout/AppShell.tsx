"use client";

import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import { HeroLogoRefProvider } from "@/contexts/HeroLogoRefContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const { loading, setLoading } = useLoading();

  return (
    <>
      <LoadingScreen onComplete={() => setLoading(false)} />
      <SmoothScroll enabled={!loading}>
        <div
          style={{
            opacity: loading ? 0 : 1,
            transition: "opacity 0.3s ease-out",
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          {children}
        </div>
      </SmoothScroll>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <HeroLogoRefProvider>
        <AppShellContent>{children}</AppShellContent>
      </HeroLogoRefProvider>
    </LoadingProvider>
  );
}
