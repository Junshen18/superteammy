import Link from "next/link";
import { Twitter, MessageCircle, Globe } from "lucide-react";

const socialLinks = [
  { href: "https://x.com/SuperteamMY", label: "Twitter/X", icon: Twitter },
  { href: "https://t.me/superteammy", label: "Telegram", icon: MessageCircle },
  { href: "https://superteam.fun", label: "Superteam Global", icon: Globe },
];

const quickLinks = [
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "/members", label: "Members" },
  { href: "#community", label: "Community" },
  { href: "#faq", label: "FAQ" },
];

const resourceLinks = [
  { href: "https://superteam.fun", label: "Superteam Global" },
  { href: "https://earn.superteam.fun", label: "Superteam Earn" },
  { href: "https://solana.com", label: "Solana" },
  { href: "https://solana.com/branding", label: "Solana Brand Kit" },
];

export function Footer() {
  return (
    <footer className="bg-[#060612] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-wider text-white">
                SUPERTEAM
              </span>
              <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-wider text-solana-purple">
                MY
              </span>
            </Link>
            <p className="text-sm text-muted-dark leading-relaxed mb-6">
              The home for Solana builders in Malaysia. Building the future of Web3 together.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-solana-purple hover:bg-surface-light transition-all"
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-dark hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-dark hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Join Us
            </h4>
            <p className="text-sm text-muted-dark leading-relaxed mb-4">
              Connect with builders, creators, and founders growing the Solana ecosystem in Malaysia.
            </p>
            <a
              href="https://t.me/superteammy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-opacity"
            >
              Join Telegram
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-dark">
            &copy; {new Date().getFullYear()} Superteam Malaysia. Built on Solana.
          </p>
          <p className="text-xs text-muted-dark">
            Part of the global{" "}
            <a
              href="https://superteam.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-solana-purple hover:underline"
            >
              Superteam
            </a>{" "}
            network.
          </p>
        </div>
      </div>
    </footer>
  );
}
