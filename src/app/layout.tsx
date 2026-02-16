import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Superteam Malaysia | The Home for Solana Builders in Malaysia",
  description:
    "Superteam Malaysia connects builders, creators, and founders in the Solana ecosystem. Access grants, bounties, hackathons, and a global network of Web3 talent.",
  keywords: [
    "Superteam",
    "Malaysia",
    "Solana",
    "Web3",
    "Blockchain",
    "Crypto",
    "Builders",
    "Community",
  ],
  openGraph: {
    title: "Superteam Malaysia | The Home for Solana Builders",
    description:
      "Join the fastest-growing Solana community in Malaysia. Access grants, bounties, hackathons, and connect with top Web3 talent.",
    url: "https://my.superteam.fun",
    siteName: "Superteam Malaysia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@SuperteamMY",
    title: "Superteam Malaysia",
    description:
      "The Home for Solana Builders in Malaysia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
