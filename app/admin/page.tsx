"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Topic } from "@/types/topic";

function AdminTopbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  }

  return (
    <nav
      className="sticky top-0 z-50 h-14 flex items-center px-6 gap-8 border-b border-white/10"
      style={{ background: "#1e2a3a" }}
    >
      <div className="flex items-center gap-2.5 flex-1">
        <div className="w-7 h-7 bg-gold rounded flex items-center justify-center">
          <span className="font-bold text-sm leading-none" style={{ color: "#0B3C5D" }}>E</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-bold text-sm tracking-tight">EduLynx Admin</span>
          <span className="text-white/40 text-[9px] uppercase tracking-widest leading-none">
            Think Tank Upload Panel
          </span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-white/50 hover:text-white text-xs font-semibold border border-white/10 px-3 py-1.5 rounded hover:bg-white/5 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
}

function LevelBadge({ level }: { level: string }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
        level === "HL"
          ? "bg-blue-100 text-blue-800"
          : "bg-indigo-100 text-indigo-800"
      }`}
    >
      {level}
    </span>
  );
}

function ServiceBadge({ type }: { type: string }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
        type === "IA"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {type}
    </span>
  );
}

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    Draft: "bg-yellow-100 text-yellow-800",
    Archived: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${styles[status] ?? styles.Draft}`}>
      {status}
    </span>
  );
}

function BandBadge({ bands }: { bands: number[] }) {
  const max = Math.max(...bands);
  const colorMap: Record<number, string> = {
    7: "bg-gold text-white",
    6: "bg-navy text-white",
    5: "bg-charcoal/70 text-white",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${colorMap[max] ?? "bg-gray-200 text-gray-800"}`}>
      Band {max}
    </span>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics?all=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTopics(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = topics.length;
  const active = topics.filter((t) => t.status === "Active").length;
  const drafts = topics.filter((t) => t.status === "Draft").length;
  const withPdf = topics.filter((t) => t.pdfUrl).length;

  async function handleArchive(id: string) {
    if (!confirm("Archive this topic?")) return;
    await fetch(`/api/topics/${id}`, { method: "DELETE" });
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Archived" } : t))
    );
  }

  return (
    <div className="min-h-screen bg-warm">
      <AdminTopbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Topics", value: total },
            { label: "Active", value: active },
            { label: "Drafts", value: drafts },
            { label: "PDFs Uploaded", value: withPdf },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4 text-center"
              style={{ borderTop: "3px solid #0B3C5D" }}
            >
              <p className="text-3xl font-bold text-navy">{loading ? "—" : stat.value}</p>
              <p className="text-xs text-charcoal/50 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/admin/upload"
            className="bg-navy text-white rounded-xl px-6 py-5 flex items-center gap-4 hover:bg-navy/90 transition-colors group"
          >
            <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center text-gold text-xl shrink-0">
              ↑
            </div>
            <div>
              <p className="font-bold text-white">Upload New Topic</p>
              <p className="text-white/50 text-xs mt-0.5">Add PDF and metadata to the inventory</p>
            </div>
            <span className="ml-auto text-white/30 group-hover:text-white transition-colors">→</span>
          </Link>

          <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center text-navy text-xl shrink-0">
              ⊞
            </div>
            <div>
              <p className="font-bold text-navy">Manage Topics</p>
              <p className="text-charcoal/50 text-xs mt-0.5">Edit, archive, or update existing topics</p>
            </div>
          </div>
        </div>

        {/* Topics table */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h2 className="font-bold text-navy text-sm">
              All Topics
              <span className="ml-2 text-charcoal/40 font-normal text-xs">{total} total</span>
            </h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-charcoal/40 text-sm">Loading topics…</div>
          ) : topics.length === 0 ? (
            <div className="px-6 py-12 text-center text-charcoal/40 text-sm">
              No topics yet.{" "}
              <Link href="/admin/upload" className="text-navy underline">
                Upload the first one →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-warm border-b border-[#e2e8f0]">
                    {["Title", "Subject", "Level", "Service", "Band", "Status", "PDF", "Uploaded", "Actions"].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-4 py-2.5 text-left text-[10px] font-bold text-charcoal/50 uppercase tracking-wider whitespace-nowrap"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {topics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-warm/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy text-xs max-w-[200px] truncate">
                          {topic.topicTitle}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs text-charcoal/60 whitespace-nowrap">
                        {topic.subject}
                      </td>
                      <td className="px-4 py-3">
                        <LevelBadge level={topic.level} />
                      </td>
                      <td className="px-4 py-3">
                        <ServiceBadge type={topic.serviceType} />
                      </td>
                      <td className="px-4 py-3">
                        <BandBadge bands={topic.targetBand} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusChip status={topic.status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {topic.pdfUrl ? (
                          <span className="text-green-600 font-bold text-xs">✓</span>
                        ) : (
                          <span className="text-charcoal/25 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-charcoal/50 whitespace-nowrap">
                        {topic.createdAt
                          ? new Date(topic.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/edit/${topic.id}`)}
                            className="text-xs font-semibold text-navy hover:underline"
                          >
                            Edit
                          </button>
                          <span className="text-charcoal/20">|</span>
                          <button
                            onClick={() => handleArchive(topic.id)}
                            disabled={topic.status === "Archived"}
                            className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
