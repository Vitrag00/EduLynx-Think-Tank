import React from "react";
import Link from "next/link";

const SUBJECTS = {
  STEM: ["Physics", "Chemistry", "Mathematics", "Biology"],
  "Applied STEM": ["Sports Science", "Physiology", "Environmental Systems", "Computer Science"],
};

const VALUE_PROPS = [
  {
    icon: "⊞",
    title: "Filter with Precision",
    desc: "Filter by subject, level, methodology type, target band, and more. Find exactly what fits your academic context.",
  },
  {
    icon: "⇄",
    title: "Compare Side by Side",
    desc: "Select up to 3 topics and compare feasibility, methodology, risk, and alignment across a structured table.",
  },
  {
    icon: "✦",
    title: "Custom Ideation",
    desc: "Input your academic context and generate a bespoke topic direction calibrated to your subject and band target.",
  },
  {
    icon: "◈",
    title: "Band-Calibrated Pathways",
    desc: "Every topic in the inventory is tagged to target bands 5, 6, or 7. No guesswork about ceiling potential.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/15 rounded-full px-4 py-1.5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
          <span className="text-xs font-semibold text-navy/70 uppercase tracking-widest">
            IB Diploma Academic Intelligence
          </span>
        </div>
        <h1 className="text-4xl font-bold text-navy leading-tight mb-4">
          Discover Your Ideal<br />Academic Pathway
        </h1>
        <p className="text-base text-charcoal/60 leading-relaxed max-w-xl mx-auto mb-8">
          The EduLynx Think Tank system gives IB Diploma students structured, band-calibrated academic topic intelligence — spanning IA and EE across 8 subjects and 2 service streams.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/explore"
            className="bg-navy text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-navy-light transition-colors"
          >
            Explore Inventory
          </Link>
          <Link
            href="/ideation"
            className="bg-transparent text-navy border border-navy px-6 py-2.5 rounded font-semibold text-sm hover:bg-navy/5 transition-colors"
          >
            Custom Ideation
          </Link>
          <button className="bg-transparent text-charcoal/50 border border-[#e2e8f0] px-6 py-2.5 rounded font-semibold text-sm hover:text-charcoal transition-colors">
            Partner Demo
          </button>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="bg-navy rounded-xl px-8 py-5 mb-12 flex items-center justify-between gap-4 flex-wrap">
        {[
          { label: "Subjects", value: "8" },
          { label: "Topic Pathways", value: "40" },
          { label: "Service Streams", value: "2" },
          { label: "Band Tiers", value: "3" },
        ].map((m) => (
          <div key={m.label} className="text-center flex-1 min-w-[120px]">
            <p className="text-3xl font-bold text-white">{m.value}</p>
            <p className="text-white/50 text-xs uppercase tracking-widest mt-0.5">{m.label}</p>
          </div>
        ))}
      </section>

      {/* Value props */}
      <section className="mb-14">
        <h2 className="text-xs font-bold text-charcoal/40 uppercase tracking-widest mb-5 text-center">
          Platform Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_PROPS.map((vp) => (
            <div
              key={vp.title}
              className="bg-white border border-[#e2e8f0] rounded-lg px-5 py-5 hover:shadow-md transition-shadow"
              style={{ borderTop: "3px solid #0B3C5D" }}
            >
              <span className="text-2xl text-navy/30 block mb-3">{vp.icon}</span>
              <h3 className="font-bold text-navy text-sm mb-2">{vp.title}</h3>
              <p className="text-xs text-charcoal/60 leading-relaxed">{vp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subject group cards */}
      <section>
        <h2 className="text-xs font-bold text-charcoal/40 uppercase tracking-widest mb-5 text-center">
          Subject Inventory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(SUBJECTS).map(([group, subjects]) => (
            <div
              key={group}
              className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden"
            >
              <div className="bg-navy px-5 py-4">
                <p className="text-gold text-[10px] font-bold uppercase tracking-widest mb-0.5">Group</p>
                <h3 className="text-white font-bold text-base">{group}</h3>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-2">
                {subjects.map((subj) => (
                  <Link
                    key={subj}
                    href={`/explore`}
                    className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-navy hover:bg-warm px-2 py-1.5 rounded transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-navy/20 group-hover:bg-navy transition-colors" />
                    {subj}
                  </Link>
                ))}
              </div>
              <div className="px-5 pb-4">
                <Link
                  href="/explore"
                  className="text-xs font-semibold text-navy hover:text-gold transition-colors"
                >
                  Browse {group} topics →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
