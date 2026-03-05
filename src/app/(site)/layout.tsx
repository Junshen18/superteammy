import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppShell } from "@/components/layout/AppShell";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </AppShell>
  );
}
