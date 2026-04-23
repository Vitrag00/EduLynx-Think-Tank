"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/explore", label: "Inventory Explorer" },
  { href: "/compare", label: "Compare" },
  { href: "/ideation", label: "Custom Ideation" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 h-14 flex items-center px-6 gap-8"
      style={{ background: "#1e2a3a" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 bg-gold rounded flex items-center justify-center">
          <span className="text-navy-deeper font-bold text-sm leading-none">E</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-bold text-sm tracking-tight">EduLynx</span>
          <span className="text-white/40 text-[9px] uppercase tracking-widest leading-none">Think Tank Division</span>
        </div>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1 flex-1">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-gold/15 text-gold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Phase pill */}
      <span className="border border-gold/50 text-gold text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0">
        Phase 1 · Demo
      </span>
    </nav>
  );
}
