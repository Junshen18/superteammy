"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "/members", label: "Members" },
  { href: "#community", label: "Community" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-wider text-white">
              SUPERTEAM
            </span>
            <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-wider text-solana-purple">
              MY
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://t.me/superteammy"
              target="_blank"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-opacity"
            >
              Join Community
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg text-muted hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="https://t.me/superteammy"
                target="_blank"
                className="block w-full text-center px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green"
              >
                Join Community
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
