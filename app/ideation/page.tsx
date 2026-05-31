import React from "react";
import { IdeationForm } from "@/components/ideation/IdeationForm";

export default function IdeationPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-navy mb-1">Custom Ideation</h1>
        <p className="text-sm text-charcoal/50">
          Generate a personalised topic direction calibrated to your academic context and band target.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form — 2/3 width */}
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-6">
          <IdeationForm />
        </div>

        {/* Aside — 1/3 width */}
        <aside className="space-y-4">
          {/* RQ Tips */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <h3 className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-3">
              Writing a Strong RQ
            </h3>
            <ul className="space-y-2 text-xs text-charcoal/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-gold font-bold shrink-0">→</span>
                Frame as &ldquo;To what extent does X affect Y in context Z?&rdquo;
              </li>
              <li className="flex gap-2">
                <span className="text-gold font-bold shrink-0">→</span>
                Keep one independent variable clearly identified
              </li>
              <li className="flex gap-2">
                <span className="text-gold font-bold shrink-0">→</span>
                Ensure measurability — the outcome must be quantifiable or clearly qualifiable
              </li>
              <li className="flex gap-2">
                <span className="text-gold font-bold shrink-0">→</span>
                Avoid binary yes/no RQs — use a spectrum
              </li>
            </ul>
          </div>

          {/* Band Guide */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <h3 className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-3">
              Band Calibration Guide
            </h3>
            <div className="space-y-2.5">
              <BandRow
                band={5}
                color="bg-amber-500"
                desc="Reliable methodology, clear theory, clean data"
              />
              <BandRow
                band={6}
                color="bg-blue-600"
                desc="Original angle, strong analysis, minor complexity"
              />
              <BandRow
                band={7}
                color="bg-green-600"
                desc="High innovation, sophisticated method, interdisciplinary depth"
              />
            </div>
          </div>

          {/* Consultation CTA */}
          <div
            className="rounded-xl p-5 text-white"
            style={{ background: "#1e2a3a" }}
          >
            <span className="text-gold text-[10px] font-bold uppercase tracking-widest block mb-2">
              Expert Guidance
            </span>
            <h3 className="font-bold text-base mb-2">Work with an EduLynx Mentor</h3>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Our subject-specialist mentors can review your topic direction, refine your RQ, and help you build a methodology that hits your target band.
            </p>
            <button className="w-full bg-gold text-white py-2 rounded text-sm font-semibold hover:bg-gold-light transition-colors">
              Request a Consultation →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BandRow({
  band,
  color,
  desc,
}: {
  band: number;
  color: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`${color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5`}
      >
        {band}
      </span>
      <p className="text-xs text-charcoal/70">{desc}</p>
    </div>
  );
}
