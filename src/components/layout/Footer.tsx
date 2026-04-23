"use client";
import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-[#e2e8f0] bg-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gold rounded flex items-center justify-center">
            <span className="text-navy-deeper font-bold text-xs leading-none">E</span>
          </div>
          <span className="text-charcoal/50 text-xs">EduLynx Think Tank Division — Phase 1 Demo</span>
        </div>
        <span className="text-charcoal/30 text-xs">IBDP Academic Intelligence Platform · 2026</span>
      </div>
    </footer>
  );
}
