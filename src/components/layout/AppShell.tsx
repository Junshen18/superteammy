"use client";

import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

function AppShellContent({ children }: { children: React.ReactNode }) {
  const { loading, setLoading } = useLoading();

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <SmoothScroll enabled={!loading}>
        <div
          style={{
            opacity: loading ? 0 : 1,
            transition: "opacity 0.3s ease-in",
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
      <AppShellContent>{children}</AppShellContent>
    </LoadingProvider>
  );
}
