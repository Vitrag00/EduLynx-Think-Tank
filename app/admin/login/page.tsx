"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error ?? "Incorrect password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0f1a26" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center mb-4 shadow-lg">
            <span className="text-navy-deeper font-bold text-2xl leading-none">E</span>
          </div>
          <h1 className="text-white font-bold text-xl tracking-tight">EduLynx</h1>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">
            Think Tank Division
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1e2a3a] rounded-xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-white font-bold text-lg mb-1">Admin Access</h2>
          <p className="text-white/40 text-xs mb-6">
            Enter your admin password to access the dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
                className="w-full bg-[#0f1a26] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gold text-navy-deeper font-bold py-3 rounded-lg text-sm hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ color: "#0B3C5D" }}
            >
              {loading ? "Authenticating…" : "Enter Dashboard"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          EduLynx Think Tank · Admin Panel
        </p>
      </div>
    </div>
  );
}
