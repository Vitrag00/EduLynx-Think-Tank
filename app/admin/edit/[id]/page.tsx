"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Topic } from "@/types/topic";

const editSchema = z.object({
  subject_group: z.enum(["STEM", "Applied STEM"]),
  subject: z.string().min(1, "Subject is required"),
  service_type: z.enum(["IA", "EE"]),
  level: z.enum(["SL", "HL"]),
  target_band: z.array(z.number()).min(1, "Select at least one band"),
  inventory_type: z.enum(["Pre-Built", "Custom"]),
  status: z.enum(["Active", "Draft", "Archived"]),
  title: z.string().min(1, "Title is required"),
  topic_area: z.string().min(1, "Topic area is required"),
  draft_rq: z.string().min(1, "Draft RQ is required"),
  abstract: z.string(),
  rationale: z.string().min(1, "Rationale is required"),
  why_it_works: z.string().min(1, "Why it works is required"),
  key_theory: z.array(z.string()),
  feasibility: z.number().min(1).max(10),
  innovation: z.number().min(1).max(10),
  complexity: z.enum(["Low", "Moderate", "High"]),
  data_availability: z.enum(["High", "Moderate", "Low"]),
  interdisciplinary: z.boolean(),
  estimated_hours: z.number().min(1),
  methodology: z.string().min(1, "Methodology is required"),
  methodology_type: z.enum(["Quantitative", "Qualitative", "Mixed"]),
  primary_source: z.string().min(1, "Primary source is required"),
  data_comfort: z.string().min(1, "Data comfort is required"),
  recommended_for: z.string().min(1, "Recommended for is required"),
  prerequisite_skills: z.array(z.string()),
  risk_flags: z.array(z.string()),
  mentor_note: z.string(),
});

type EditFormData = z.infer<typeof editSchema>;

const SUBJECTS: Record<string, string[]> = {
  STEM: ["Physics", "Chemistry", "Mathematics", "Biology"],
  "Applied STEM": ["Sports Science", "Physiology", "Environmental Systems", "Computer Science"],
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

function AdminTopbar({ topicTitle }: { topicTitle: string }) {
  return (
    <nav
      className="sticky top-0 z-50 h-14 flex items-center px-6 gap-4 border-b border-white/10"
      style={{ background: "#1e2a3a" }}
    >
      <Link href="/admin" className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-gold rounded flex items-center justify-center">
          <span className="font-bold text-sm leading-none" style={{ color: "#0B3C5D" }}>E</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-bold text-sm tracking-tight">EduLynx Admin</span>
          <span className="text-white/40 text-[9px] uppercase tracking-widest leading-none">
            {topicTitle ? `Editing: ${topicTitle.slice(0, 40)}` : "Edit Topic"}
          </span>
        </div>
      </Link>
      <div className="flex-1" />
      <Link
        href="/admin"
        className="text-white/50 hover:text-white text-xs font-semibold border border-white/10 px-3 py-1.5 rounded hover:bg-white/5 transition-colors"
      >
        ← Dashboard
      </Link>
    </nav>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-charcoal/70 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-4 pb-2 border-b border-[#e2e8f0]">
      {children}
    </h3>
  );
}

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  multi,
}: {
  options: T[];
  value: T | T[];
  onChange: (val: T | T[]) => void;
  multi?: boolean;
}) {
  const selected = Array.isArray(value) ? value : [value];
  function toggle(opt: T) {
    if (multi) {
      const arr = selected as T[];
      onChange((arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]) as T[]);
    } else {
      onChange(opt);
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              active ? "bg-navy text-white border-navy" : "bg-white text-charcoal/60 border-[#e2e8f0] hover:border-navy/30"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (t: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  function addTag() {
    const tag = input.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  }
  return (
    <div className="border border-[#e2e8f0] rounded-lg p-2.5 bg-white focus-within:border-navy/30 transition-all">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy text-white text-xs rounded-full font-medium">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="text-white/60 hover:text-white">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
        onBlur={addTag}
        placeholder={placeholder ?? "Type and press Enter…"}
        className="w-full text-xs text-charcoal/80 placeholder-charcoal/30 outline-none bg-transparent"
      />
    </div>
  );
}

function inputClass(err?: boolean) {
  return `w-full border ${err ? "border-red-400" : "border-[#e2e8f0]"} rounded-lg px-3 py-2.5 text-sm text-charcoal/90 placeholder-charcoal/30 focus:outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/10 transition-all bg-white`;
}
function textareaClass(err?: boolean) {
  return `w-full border ${err ? "border-red-400" : "border-[#e2e8f0]"} rounded-lg px-3 py-2.5 text-sm text-charcoal/90 placeholder-charcoal/30 focus:outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/10 transition-all bg-white resize-none`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EditTopicPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [topicTitle, setTopicTitle] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditFormData>({ resolver: zodResolver(editSchema) });

  const subjectGroup = watch("subject_group") as string;
  const subjects = SUBJECTS[subjectGroup] ?? [];

  useEffect(() => {
    fetch(`/api/topics/${params.id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((topic: Topic | null) => {
        if (!topic) return;
        setTopicTitle(topic.topicTitle);
        reset({
          subject_group: topic.subjectGroup as EditFormData["subject_group"],
          subject: topic.subject,
          service_type: topic.serviceType,
          level: topic.level,
          target_band: topic.targetBand as number[],
          inventory_type: topic.inventoryType,
          status: topic.status as EditFormData["status"],
          title: topic.topicTitle,
          topic_area: topic.topicArea,
          draft_rq: topic.draftRQ,
          abstract: topic.abstract ?? "",
          rationale: topic.rationale,
          why_it_works: topic.whyItWorks,
          key_theory: topic.keyTheory,
          feasibility: topic.feasibility,
          innovation: topic.innovation,
          complexity: topic.complexity,
          data_availability: topic.dataAvailability,
          interdisciplinary: topic.interdisciplinary,
          estimated_hours: topic.estimatedHours,
          methodology: topic.methodology,
          methodology_type: topic.methodologyType,
          primary_source: topic.primarySource,
          data_comfort: topic.dataComfort,
          recommended_for: topic.recommendedFor,
          prerequisite_skills: topic.prerequisiteSkills,
          risk_flags: topic.riskFlags,
          mentor_note: topic.mentorNote ?? "",
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id, reset]);

  async function onSubmit(data: EditFormData) {
    setSubmitStatus("submitting");
    setSubmitError(null);

    const payload = {
      title: data.title,
      subject: data.subject,
      subject_group: data.subject_group,
      service_type: data.service_type,
      level: data.level,
      target_band: data.target_band,
      topic_area: data.topic_area,
      draft_rq: data.draft_rq,
      abstract: data.abstract,
      rationale: data.rationale,
      why_it_works: data.why_it_works,
      key_theory: data.key_theory,
      feasibility: data.feasibility,
      innovation: data.innovation,
      complexity: data.complexity,
      data_availability: data.data_availability,
      interdisciplinary: data.interdisciplinary,
      estimated_hours: data.estimated_hours,
      methodology: data.methodology,
      methodology_type: data.methodology_type,
      primary_source: data.primary_source,
      data_comfort: data.data_comfort,
      recommended_for: data.recommended_for,
      prerequisite_skills: data.prerequisite_skills,
      risk_flags: data.risk_flags,
      inventory_type: data.inventory_type,
      status: data.status,
      mentor_note: data.mentor_note ?? "",
    };

    try {
      const res = await fetch(`/api/topics/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        setSubmitStatus("success");
        setTopicTitle(data.title);
      } else {
        setSubmitError(result.error ?? "Update failed");
        setSubmitStatus("error");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
      setSubmitStatus("error");
    }
  }

  async function handleArchive() {
    if (!confirm("Archive this topic? It will no longer appear in the public inventory.")) return;
    const res = await fetch(`/api/topics/${params.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm">
        <AdminTopbar topicTitle="" />
        <div className="flex items-center justify-center py-24 text-charcoal/40 text-sm">Loading topic…</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-warm">
        <AdminTopbar topicTitle="Not Found" />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-charcoal/60 text-sm mb-4">Topic not found or could not be loaded.</p>
          <Link href="/admin" className="text-navy font-semibold text-sm underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm">
      <AdminTopbar topicTitle={topicTitle} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy">Edit Topic</h1>
            <p className="text-charcoal/50 text-sm mt-0.5 max-w-xl truncate">{topicTitle}</p>
          </div>
          <button
            type="button"
            onClick={handleArchive}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
          >
            Archive Topic
          </button>
        </div>

        {submitStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <p className="text-green-700 text-sm font-medium">Topic updated successfully</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Classification */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
            <SectionHeading>Classification</SectionHeading>
            <div className="space-y-5">
              <div>
                <FieldLabel required>Subject Group</FieldLabel>
                <Controller
                  name="subject_group"
                  control={control}
                  render={({ field }) => (
                    <ChipGroup options={["STEM", "Applied STEM"] as const} value={field.value} onChange={(v) => field.onChange(v)} />
                  )}
                />
              </div>
              <div>
                <FieldLabel required>Subject</FieldLabel>
                <select {...register("subject")} className={inputClass(!!errors.subject)}>
                  <option value="">Select subject…</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <FieldError message={errors.subject?.message} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Service Type</FieldLabel>
                  <Controller name="service_type" control={control} render={({ field }) => (
                    <ChipGroup options={["IA", "EE"] as const} value={field.value} onChange={(v) => field.onChange(v)} />
                  )} />
                </div>
                <div>
                  <FieldLabel required>Level</FieldLabel>
                  <Controller name="level" control={control} render={({ field }) => (
                    <ChipGroup options={["SL", "HL"] as const} value={field.value} onChange={(v) => field.onChange(v)} />
                  )} />
                </div>
              </div>
              <div>
                <FieldLabel required>Target Band</FieldLabel>
                <Controller name="target_band" control={control} render={({ field }) => (
                  <ChipGroup
                    options={[5, 6, 7] as unknown as string[]}
                    value={field.value as unknown as string[]}
                    onChange={(v) => field.onChange(v)}
                    multi
                  />
                )} />
                <FieldError message={errors.target_band?.message} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FieldLabel required>Inventory Type</FieldLabel>
                  <Controller name="inventory_type" control={control} render={({ field }) => (
                    <ChipGroup options={["Pre-Built", "Custom"] as const} value={field.value} onChange={(v) => field.onChange(v)} />
                  )} />
                </div>
                <div className="col-span-2">
                  <FieldLabel required>Status</FieldLabel>
                  <Controller name="status" control={control} render={({ field }) => (
                    <ChipGroup options={["Active", "Draft", "Archived"] as const} value={field.value} onChange={(v) => field.onChange(v)} />
                  )} />
                </div>
              </div>
            </div>
          </div>

          {/* Topic Content */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
            <SectionHeading>Topic Content</SectionHeading>
            <div className="space-y-5">
              <div>
                <FieldLabel required>Topic Title</FieldLabel>
                <input {...register("title")} className={inputClass(!!errors.title)} />
                <FieldError message={errors.title?.message} />
              </div>
              <div>
                <FieldLabel required>Topic Area</FieldLabel>
                <input {...register("topic_area")} className={inputClass(!!errors.topic_area)} />
                <FieldError message={errors.topic_area?.message} />
              </div>
              <div>
                <FieldLabel required>Draft Research Question</FieldLabel>
                <textarea {...register("draft_rq")} rows={3} className={textareaClass(!!errors.draft_rq)} />
                <FieldError message={errors.draft_rq?.message} />
              </div>
              <div>
                <FieldLabel>Abstract</FieldLabel>
                <textarea {...register("abstract")} rows={4} className={textareaClass()} />
              </div>
              <div>
                <FieldLabel required>Rationale</FieldLabel>
                <input {...register("rationale")} className={inputClass(!!errors.rationale)} />
                <FieldError message={errors.rationale?.message} />
              </div>
              <div>
                <FieldLabel required>Why It Works</FieldLabel>
                <textarea {...register("why_it_works")} rows={3} className={textareaClass(!!errors.why_it_works)} />
                <FieldError message={errors.why_it_works?.message} />
              </div>
              <div>
                <FieldLabel>Key Theory & Concepts</FieldLabel>
                <Controller name="key_theory" control={control} render={({ field }) => (
                  <TagInput value={field.value} onChange={field.onChange} />
                )} />
              </div>
            </div>
          </div>

          {/* Academic Fit */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
            <SectionHeading>Academic Fit</SectionHeading>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Complexity</FieldLabel>
                  <Controller name="complexity" control={control} render={({ field }) => (
                    <ChipGroup options={["Low", "Moderate", "High"] as const} value={field.value} onChange={(v) => field.onChange(v)} />
                  )} />
                </div>
                <div>
                  <FieldLabel>Data Availability</FieldLabel>
                  <Controller name="data_availability" control={control} render={({ field }) => (
                    <ChipGroup options={["High", "Moderate", "Low"] as const} value={field.value} onChange={(v) => field.onChange(v)} />
                  )} />
                </div>
              </div>
              <div>
                <FieldLabel>Estimated Hours</FieldLabel>
                <input type="number" {...register("estimated_hours", { valueAsNumber: true })} min={1} className="w-32 border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-navy/40" />
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
            <SectionHeading>Methodology</SectionHeading>
            <div className="space-y-5">
              <div>
                <FieldLabel required>Methodology</FieldLabel>
                <input {...register("methodology")} className={inputClass(!!errors.methodology)} />
                <FieldError message={errors.methodology?.message} />
              </div>
              <div>
                <FieldLabel required>Methodology Type</FieldLabel>
                <Controller name="methodology_type" control={control} render={({ field }) => (
                  <ChipGroup options={["Quantitative", "Qualitative", "Mixed"] as const} value={field.value} onChange={(v) => field.onChange(v)} />
                )} />
              </div>
              <div>
                <FieldLabel required>Primary Source</FieldLabel>
                <input {...register("primary_source")} className={inputClass(!!errors.primary_source)} />
              </div>
              <div>
                <FieldLabel required>Data Comfort</FieldLabel>
                <input {...register("data_comfort")} className={inputClass(!!errors.data_comfort)} />
              </div>
            </div>
          </div>

          {/* Student Profile */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
            <SectionHeading>Student Profile</SectionHeading>
            <div className="space-y-5">
              <div>
                <FieldLabel required>Recommended For</FieldLabel>
                <textarea {...register("recommended_for")} rows={3} className={textareaClass(!!errors.recommended_for)} />
                <FieldError message={errors.recommended_for?.message} />
              </div>
              <div>
                <FieldLabel>Prerequisite Skills</FieldLabel>
                <Controller name="prerequisite_skills" control={control} render={({ field }) => (
                  <TagInput value={field.value} onChange={field.onChange} />
                )} />
              </div>
              <div>
                <FieldLabel>Risk Flags</FieldLabel>
                <Controller name="risk_flags" control={control} render={({ field }) => (
                  <TagInput value={field.value} onChange={field.onChange} />
                )} />
              </div>
              <div>
                <FieldLabel>Mentor Note</FieldLabel>
                <textarea {...register("mentor_note")} rows={2} placeholder="Internal notes…" className={textareaClass()} />
              </div>
            </div>
          </div>

          {submitStatus === "error" && submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3">
              <p className="text-red-700 text-sm font-medium">{submitError}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pb-8">
            <Link href="/admin" className="px-5 py-3 rounded-lg text-sm font-semibold border border-[#e2e8f0] text-charcoal/60 hover:bg-warm transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitStatus === "submitting"}
              className="flex-1 py-3 rounded-lg text-sm font-bold bg-navy text-white hover:bg-navy/90 disabled:opacity-50 transition-colors"
            >
              {submitStatus === "submitting" ? "Updating…" : "Update Topic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
