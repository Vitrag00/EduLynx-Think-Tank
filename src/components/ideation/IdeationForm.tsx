"use client";
import React, { useState } from "react";

type Step = 1 | 2 | 3 | 4;

const SUBJECT_MAP: Record<string, string[]> = {
  STEM: ["Physics", "Chemistry", "Mathematics", "Biology"],
  "Applied STEM": ["Sports Science", "Physiology", "Environmental Systems", "Computer Science"],
};

const METHODOLOGY_OPTIONS = ["Experiment", "Survey", "Secondary Data", "Case Study", "No Preference"];
const DATA_COMFORT_OPTIONS = ["Basic", "Statistical", "Advanced"];
const DATA_ACCESS_OPTIONS = ["School lab equipment", "Online databases", "Field access", "Software tools", "Survey participants"];

interface FormState {
  programme: string;
  serviceType: string;
  subjectGroup: string;
  subject: string;
  level: string;
  targetBand: number | null;
  interests: string;
  methodology: string;
  dataComfort: string;
  dataAccess: string[];
  notes: string;
}

function ChipSelector({
  options,
  active,
  onToggle,
  multi,
}: {
  options: string[];
  active: string | string[] | null | number;
  onToggle: (v: string) => void;
  multi?: boolean;
}) {
  const isActive = (v: string) => {
    if (multi && Array.isArray(active)) return active.includes(v);
    return active === v || String(active) === v;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors ${
            isActive(opt)
              ? "bg-navy text-white border-navy"
              : "bg-white text-charcoal/70 border-[#e2e8f0] hover:border-navy/50 hover:text-navy"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const MOCK_TOPIC_OUTPUT = (form: FormState) => ({
  title: `${form.subject} ${form.serviceType === "EE" ? "Extended Essay" : "Internal Assessment"}: ${form.interests.slice(0, 40) || "Custom Research Direction"}`,
  rq: `To what extent does ${form.interests.slice(0, 60) || "your chosen variable"} affect measurable outcomes in a ${form.subject} context using ${form.methodology || "selected"} methodology?`,
  methodology: form.methodology || "Mixed",
  feasibility: 7,
  innovation: 8,
  band: form.targetBand || 6,
});

export function IdeationForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>({
    programme: "IBDP",
    serviceType: "",
    subjectGroup: "",
    subject: "",
    level: "",
    targetBand: null,
    interests: "",
    methodology: "",
    dataComfort: "",
    dataAccess: [],
    notes: "",
  });

  const set = (key: keyof FormState, value: string | number | string[] | null) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleDataAccess = (val: string) => {
    setForm((prev) => ({
      ...prev,
      dataAccess: prev.dataAccess.includes(val)
        ? prev.dataAccess.filter((v) => v !== val)
        : [...prev.dataAccess, val],
    }));
  };

  const subjects = form.subjectGroup ? SUBJECT_MAP[form.subjectGroup] ?? [] : [];
  const output = MOCK_TOPIC_OUTPUT(form);

  const stepDone = (s: number) => step > s;
  const stepActive = (s: number) => step === s;

  return (
    <div>
      {/* Progress indicator */}
      <div className="flex items-center gap-0 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  stepDone(s)
                    ? "bg-green-500 border-green-500 text-white"
                    : stepActive(s)
                    ? "bg-navy border-navy text-white"
                    : "bg-white border-[#e2e8f0] text-charcoal/40"
                }`}
              >
                {stepDone(s) ? "✓" : s}
              </div>
              <span
                className={`text-xs font-medium ${
                  stepActive(s) ? "text-navy" : stepDone(s) ? "text-green-600" : "text-charcoal/40"
                }`}
              >
                {["Academic Context", "Topic Direction", "Constraints"][s - 1]}
              </span>
            </div>
            {s < 3 && <div className="flex-1 h-px bg-[#e2e8f0] mx-2" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <FormSection label="Programme">
            <div className="px-3 py-2 bg-warm border border-[#e2e8f0] rounded text-sm text-charcoal/60">
              IBDP (International Baccalaureate Diploma Programme)
            </div>
          </FormSection>

          <FormSection label="Service Type">
            <ChipSelector
              options={["IA", "EE"]}
              active={form.serviceType}
              onToggle={(v) => set("serviceType", v)}
            />
          </FormSection>

          <FormSection label="Subject Group">
            <ChipSelector
              options={["STEM", "Applied STEM"]}
              active={form.subjectGroup}
              onToggle={(v) => {
                set("subjectGroup", v);
                set("subject", "");
              }}
            />
          </FormSection>

          <FormSection label="Subject">
            <select
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              className="w-full border border-[#e2e8f0] rounded px-3 py-2 text-sm text-charcoal bg-white focus:outline-none focus:border-navy"
              disabled={!form.subjectGroup}
            >
              <option value="">Select a subject</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormSection>

          <FormSection label="Level">
            <ChipSelector
              options={["SL", "HL"]}
              active={form.level}
              onToggle={(v) => set("level", v)}
            />
          </FormSection>

          <FormSection label="Target Band">
            <ChipSelector
              options={["5", "6", "7"]}
              active={form.targetBand ? String(form.targetBand) : ""}
              onToggle={(v) => set("targetBand", Number(v))}
            />
          </FormSection>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!form.serviceType || !form.subject || !form.level}
            className="w-full bg-navy text-white py-2.5 rounded font-semibold text-sm hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Topic Direction →
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-5">
          <FormSection label="Areas of Interest">
            <textarea
              value={form.interests}
              onChange={(e) => set("interests", e.target.value)}
              placeholder="Describe what you are curious about, real-world connections, personal experiences..."
              className="w-full border border-[#e2e8f0] rounded px-3 py-2 text-sm text-charcoal bg-white focus:outline-none focus:border-navy resize-none h-28"
            />
          </FormSection>

          <FormSection label="Preferred Methodology">
            <ChipSelector
              options={METHODOLOGY_OPTIONS}
              active={form.methodology}
              onToggle={(v) => set("methodology", v)}
            />
          </FormSection>

          <FormSection label="Data Comfort Level">
            <ChipSelector
              options={DATA_COMFORT_OPTIONS}
              active={form.dataComfort}
              onToggle={(v) => set("dataComfort", v)}
            />
          </FormSection>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-[#e2e8f0] text-charcoal/60 py-2.5 rounded font-semibold text-sm hover:bg-warm transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!form.interests || !form.methodology}
              className="flex-1 bg-navy text-white py-2.5 rounded font-semibold text-sm hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-5">
          <FormSection label="Data Access (select all that apply)">
            <ChipSelector
              options={DATA_ACCESS_OPTIONS}
              active={form.dataAccess}
              onToggle={toggleDataAccess}
              multi
            />
          </FormSection>

          <FormSection label="Additional Notes (optional)">
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any constraints, preferences, or context you want us to consider..."
              className="w-full border border-[#e2e8f0] rounded px-3 py-2 text-sm text-charcoal bg-white focus:outline-none focus:border-navy resize-none h-24"
            />
          </FormSection>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 border border-[#e2e8f0] text-charcoal/60 py-2.5 rounded font-semibold text-sm hover:bg-warm transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex-1 bg-gold text-white py-2.5 rounded font-semibold text-sm hover:bg-gold-light transition-colors"
            >
              Generate Direction →
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Output */}
      {step === 4 && (
        <div className="space-y-4">
          <div
            className="rounded-xl overflow-hidden border border-navy/20"
            style={{ background: "#1e2a3a" }}
          >
            <div className="px-5 py-4 border-b border-white/10">
              <span className="text-gold text-[10px] font-bold uppercase tracking-widest">
                Generated Direction
              </span>
              <h3 className="text-white font-bold text-base mt-1 leading-snug">{output.title}</h3>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Draft Research Question</p>
                <div
                  className="bg-navy-deeper/60 rounded px-4 py-3"
                  style={{ borderLeft: "3px solid #C9A24D" }}
                >
                  <p className="text-white/90 text-sm italic leading-relaxed">{output.rq}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MiniMetric label="Feasibility" value={`${output.feasibility}/10`} color="#2563eb" />
                <MiniMetric label="Innovation" value={`${output.innovation}/10`} color="#C9A24D" />
                <MiniMetric label="Target Band" value={`Band ${output.band}`} color="#16a34a" />
              </div>
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <span>Methodology:</span>
                <span className="text-white font-medium">{output.methodology}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 border border-[#e2e8f0] text-charcoal/60 py-2.5 rounded font-semibold text-sm hover:bg-warm transition-colors"
            >
              ← Revise
            </button>
            <a
              href="/explore"
              className="flex-1 bg-navy text-white py-2.5 rounded font-semibold text-sm hover:bg-navy-light transition-colors text-center"
            >
              Explore Similar Topics →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function MiniMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white/5 rounded px-3 py-2 text-center">
      <p className="font-bold text-base" style={{ color }}>{value}</p>
      <p className="text-white/40 text-[10px] uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  );
}
