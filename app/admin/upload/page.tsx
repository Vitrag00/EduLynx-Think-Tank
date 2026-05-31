"use client";
import React, { useState, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

// ─── Schema ─────────────────────────────────────────────────────────────────

const topicSchema = z.object({
  subject_group: z.enum(["STEM", "Applied STEM"]),
  subject: z.string().min(1, "Subject is required"),
  service_type: z.enum(["IA", "EE"]),
  level: z.enum(["SL", "HL"]),
  target_band: z.array(z.number()).min(1, "Select at least one band"),
  inventory_type: z.enum(["Pre-Built", "Custom"]),
  status: z.enum(["Active", "Draft"]),
  title: z.string().min(1, "Topic title is required"),
  topic_area: z.string().min(1, "Topic area is required"),
  draft_rq: z.string().min(1, "Draft RQ is required"),
  abstract: z.string().min(1, "Abstract is required"),
  rationale: z.string().min(1, "Rationale is required"),
  why_it_works: z.string().min(1, "Why it works is required"),
  key_theory: z.array(z.string()),
  feasibility: z.number().min(1).max(10),
  innovation: z.number().min(1).max(10),
  complexity: z.enum(["Low", "Moderate", "High"]),
  data_availability: z.enum(["High", "Moderate", "Low"]),
  interdisciplinary: z.boolean(),
  estimated_hours: z.number().min(1, "Must be at least 1 hour"),
  methodology: z.string().min(1, "Methodology is required"),
  methodology_type: z.enum(["Quantitative", "Qualitative", "Mixed"]),
  primary_source: z.string().min(1, "Primary source is required"),
  data_comfort: z.string().min(1, "Data comfort is required"),
  recommended_for: z.string().min(1, "Recommended for is required"),
  prerequisite_skills: z.array(z.string()),
  risk_flags: z.array(z.string()),
});

type TopicFormData = z.infer<typeof topicSchema>;

const SUBJECTS: Record<string, string[]> = {
  STEM: ["Physics", "Chemistry", "Mathematics", "Biology"],
  "Applied STEM": ["Sports Science", "Physiology", "Environmental Systems", "Computer Science"],
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function AdminTopbar() {
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
          <span className="text-white/40 text-[9px] uppercase tracking-widest leading-none">Upload New Topic</span>
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-4 pb-2 border-b border-[#e2e8f0]">
      {children}
    </h3>
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
      const next = arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt];
      onChange(next as T[]);
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
              active
                ? "bg-navy text-white border-navy"
                : "bg-white text-charcoal/60 border-[#e2e8f0] hover:border-navy/30"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="border border-[#e2e8f0] rounded-lg p-2.5 bg-white focus-within:border-navy/30 focus-within:ring-1 focus-within:ring-navy/10 transition-all">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy text-white text-xs rounded-full font-medium"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="text-white/60 hover:text-white leading-none">
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={placeholder ?? "Type and press Enter to add…"}
        className="w-full text-xs text-charcoal/80 placeholder-charcoal/30 outline-none bg-transparent"
      />
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
  color = "#0B3C5D",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  color?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-lg font-bold" style={{ color }}>
          {value}
          <span className="text-xs font-normal text-charcoal/40">/10</span>
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-navy"
      />
      <div className="flex justify-between text-[10px] text-charcoal/30 mt-0.5">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (b: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? "bg-navy" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function inputClass(hasError?: boolean) {
  return `w-full border ${hasError ? "border-red-400" : "border-[#e2e8f0]"} rounded-lg px-3 py-2.5 text-sm text-charcoal/90 placeholder-charcoal/30 focus:outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/10 transition-all bg-white`;
}

function textareaClass(hasError?: boolean) {
  return `w-full border ${hasError ? "border-red-400" : "border-[#e2e8f0]"} rounded-lg px-3 py-2.5 text-sm text-charcoal/90 placeholder-charcoal/30 focus:outline-none focus:border-navy/40 focus:ring-1 focus:ring-navy/10 transition-all bg-white resize-none`;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function UploadPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      subject_group: "STEM",
      subject: "",
      service_type: "IA",
      level: "SL",
      target_band: [],
      inventory_type: "Pre-Built",
      status: "Active",
      title: "",
      topic_area: "",
      draft_rq: "",
      abstract: "",
      rationale: "",
      why_it_works: "",
      key_theory: [],
      feasibility: 6,
      innovation: 6,
      complexity: "Moderate",
      data_availability: "Moderate",
      interdisciplinary: false,
      estimated_hours: 30,
      methodology: "",
      methodology_type: "Quantitative",
      primary_source: "",
      data_comfort: "",
      recommended_for: "",
      prerequisite_skills: [],
      risk_flags: [],
    },
  });

  const subjectGroup = watch("subject_group");
  const subjects = SUBJECTS[subjectGroup] ?? [];

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const msg = rejectedFiles[0]?.errors[0]?.message ?? "Invalid file";
        setUploadError(msg);
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;

      setUploadError(null);
      setIsUploading(true);
      setPdfUrl(null);
      setPdfFilename(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("subject_group", subjectGroup);
      formData.append("subject", watch("subject") || "general");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.pdf_url) {
          setPdfUrl(data.pdf_url);
          setPdfFilename(data.pdf_filename);
        } else {
          setUploadError(data.error ?? "Upload failed");
        }
      } catch {
        setUploadError("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [subjectGroup, watch]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
  });

  async function submitTopic(data: TopicFormData, overrideStatus?: "Draft" | "Active") {
    setSubmitStatus("submitting");
    setSubmitError(null);

    const payload = {
      ...data,
      status: overrideStatus ?? data.status,
      pdf_url: pdfUrl,
      pdf_filename: pdfFilename,
      uploaded_by: "admin",
      shortlisted: false,
      converted_to_rq: false,
      mentor_note: "",
    };

    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitError(result.error ?? "Submission failed");
        setSubmitStatus("error");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
      setSubmitStatus("error");
    }
  }

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-warm">
        <AdminTopbar />
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-navy font-bold text-2xl mb-2">Topic Published Successfully</h2>
          <p className="text-charcoal/60 text-sm mb-8">The topic has been added to the Think Tank inventory.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setSubmitStatus("idle")}
              className="bg-navy text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-navy/90 transition-colors"
            >
              Upload Another
            </button>
            <Link
              href="/admin"
              className="border border-navy text-navy px-6 py-2.5 rounded font-semibold text-sm hover:bg-navy/5 transition-colors"
            >
              View in Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm">
      <AdminTopbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-navy">Upload New Topic</h1>
          <p className="text-charcoal/50 text-sm mt-0.5">Add a PDF document and complete the topic metadata</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          {/* LEFT — PDF Upload */}
          <div className="space-y-4">
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#e2e8f0]">
                <h2 className="font-bold text-navy text-sm">PDF Document</h2>
                <p className="text-charcoal/40 text-xs mt-0.5">PDF only · Max 10MB</p>
              </div>

              <div className="p-5">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? "border-navy bg-navy/5"
                      : pdfUrl
                      ? "border-green-400 bg-green-50"
                      : "border-[#e2e8f0] hover:border-navy/30 hover:bg-warm"
                  }`}
                >
                  <input {...getInputProps()} />

                  {isUploading ? (
                    <div>
                      <div className="w-10 h-10 border-2 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-charcoal/60 font-medium">Uploading…</p>
                    </div>
                  ) : pdfUrl ? (
                    <div>
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl mx-auto mb-3">
                        ✓
                      </div>
                      <p className="text-sm font-semibold text-green-700">{pdfFilename}</p>
                      <p className="text-xs text-charcoal/40 mt-1">Click to replace</p>
                    </div>
                  ) : isDragActive ? (
                    <div>
                      <p className="text-3xl mb-2">📄</p>
                      <p className="text-sm font-semibold text-navy">Drop the PDF here</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl mb-3 text-charcoal/20">📄</p>
                      <p className="text-sm font-semibold text-charcoal/70 mb-1">
                        Drag & drop a PDF here
                      </p>
                      <p className="text-xs text-charcoal/40">or click to browse</p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <p className="text-red-500 text-xs mt-2 text-center">{uploadError}</p>
                )}
                {acceptedFiles[0] && !pdfUrl && !isUploading && (
                  <p className="text-charcoal/50 text-xs mt-2 text-center">
                    {acceptedFiles[0].name} · {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>

            {/* Sticky action hint */}
            <div className="bg-navy/5 border border-navy/10 rounded-xl px-5 py-4 text-xs text-charcoal/60 leading-relaxed">
              <p className="font-semibold text-navy mb-1">Before publishing</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Complete all required fields</li>
                <li>Upload the topic PDF (optional for drafts)</li>
                <li>Review target band and feasibility scores</li>
              </ul>
            </div>
          </div>

          {/* RIGHT — Metadata Form */}
          <form onSubmit={handleSubmit((data) => submitTopic(data))} className="space-y-6">
            {/* Section 1 — Classification */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
              <SectionHeading>Section 1 — Classification</SectionHeading>

              <div className="space-y-5">
                <div>
                  <FieldLabel required>Subject Group</FieldLabel>
                  <Controller
                    name="subject_group"
                    control={control}
                    render={({ field }) => (
                      <ChipGroup
                        options={["STEM", "Applied STEM"] as const}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                      />
                    )}
                  />
                  <FieldError message={errors.subject_group?.message} />
                </div>

                <div>
                  <FieldLabel required>Subject</FieldLabel>
                  <select
                    {...register("subject")}
                    className={inputClass(!!errors.subject)}
                  >
                    <option value="">Select subject…</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <FieldError message={errors.subject?.message} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Service Type</FieldLabel>
                    <Controller
                      name="service_type"
                      control={control}
                      render={({ field }) => (
                        <ChipGroup
                          options={["IA", "EE"] as const}
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Level</FieldLabel>
                    <Controller
                      name="level"
                      control={control}
                      render={({ field }) => (
                        <ChipGroup
                          options={["SL", "HL"] as const}
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel required>Target Band</FieldLabel>
                  <Controller
                    name="target_band"
                    control={control}
                    render={({ field }) => (
                      <ChipGroup
                        options={[5, 6, 7] as unknown as string[]}
                        value={field.value as unknown as string[]}
                        onChange={(v) => field.onChange(v)}
                        multi
                      />
                    )}
                  />
                  <FieldError message={errors.target_band?.message} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Inventory Type</FieldLabel>
                    <Controller
                      name="inventory_type"
                      control={control}
                      render={({ field }) => (
                        <ChipGroup
                          options={["Pre-Built", "Custom"] as const}
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Status</FieldLabel>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <ChipGroup
                          options={["Active", "Draft"] as const}
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 — Topic Content */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
              <SectionHeading>Section 2 — Topic Content</SectionHeading>

              <div className="space-y-5">
                <div>
                  <FieldLabel required>Topic Title</FieldLabel>
                  <input
                    {...register("title")}
                    placeholder="e.g. Effect of Exercise Intensity on Heart Rate Recovery"
                    className={inputClass(!!errors.title)}
                  />
                  <FieldError message={errors.title?.message} />
                </div>

                <div>
                  <FieldLabel required>Topic Area</FieldLabel>
                  <input
                    {...register("topic_area")}
                    placeholder="e.g. Cardiovascular Physiology"
                    className={inputClass(!!errors.topic_area)}
                  />
                  <FieldError message={errors.topic_area?.message} />
                </div>

                <div>
                  <FieldLabel required>Draft Research Question</FieldLabel>
                  <textarea
                    {...register("draft_rq")}
                    rows={3}
                    placeholder="To what extent does X affect Y in context Z?"
                    className={textareaClass(!!errors.draft_rq)}
                  />
                  <FieldError message={errors.draft_rq?.message} />
                </div>

                <div>
                  <FieldLabel required>Abstract</FieldLabel>
                  <textarea
                    {...register("abstract")}
                    rows={4}
                    placeholder="Overview visible to students — 3-5 sentences describing the topic direction…"
                    className={textareaClass(!!errors.abstract)}
                  />
                  <FieldError message={errors.abstract?.message} />
                </div>

                <div>
                  <FieldLabel required>Rationale</FieldLabel>
                  <input
                    {...register("rationale")}
                    placeholder="One-line explanation of why this topic is strong"
                    className={inputClass(!!errors.rationale)}
                  />
                  <FieldError message={errors.rationale?.message} />
                </div>

                <div>
                  <FieldLabel required>Why It Works</FieldLabel>
                  <textarea
                    {...register("why_it_works")}
                    rows={3}
                    placeholder="2-3 sentences on the academic strength of this topic…"
                    className={textareaClass(!!errors.why_it_works)}
                  />
                  <FieldError message={errors.why_it_works?.message} />
                </div>

                <div>
                  <FieldLabel>Key Theory & Concepts</FieldLabel>
                  <Controller
                    name="key_theory"
                    control={control}
                    render={({ field }) => (
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Type a concept and press Enter…"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 — Academic Fit */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
              <SectionHeading>Section 3 — Academic Fit</SectionHeading>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-6">
                  <Controller
                    name="feasibility"
                    control={control}
                    render={({ field }) => (
                      <SliderField
                        label="Feasibility"
                        value={field.value}
                        onChange={field.onChange}
                        color="#2563eb"
                      />
                    )}
                  />
                  <Controller
                    name="innovation"
                    control={control}
                    render={({ field }) => (
                      <SliderField
                        label="Innovation"
                        value={field.value}
                        onChange={field.onChange}
                        color="#C9A24D"
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Complexity</FieldLabel>
                    <Controller
                      name="complexity"
                      control={control}
                      render={({ field }) => (
                        <ChipGroup
                          options={["Low", "Moderate", "High"] as const}
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Data Availability</FieldLabel>
                    <Controller
                      name="data_availability"
                      control={control}
                      render={({ field }) => (
                        <ChipGroup
                          options={["High", "Moderate", "Low"] as const}
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-charcoal/70">Interdisciplinary</p>
                    <p className="text-[10px] text-charcoal/40 mt-0.5">Spans multiple subject areas</p>
                  </div>
                  <Controller
                    name="interdisciplinary"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>

                <div>
                  <FieldLabel required>Estimated Hours</FieldLabel>
                  <input
                    type="number"
                    {...register("estimated_hours", { valueAsNumber: true })}
                    placeholder="30"
                    min={1}
                    className={`w-32 ${inputClass(!!errors.estimated_hours)}`}
                  />
                  <FieldError message={errors.estimated_hours?.message} />
                </div>
              </div>
            </div>

            {/* Section 4 — Methodology */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
              <SectionHeading>Section 4 — Methodology</SectionHeading>

              <div className="space-y-5">
                <div>
                  <FieldLabel required>Methodology</FieldLabel>
                  <input
                    {...register("methodology")}
                    placeholder="e.g. Controlled experiment with heart rate monitor"
                    className={inputClass(!!errors.methodology)}
                  />
                  <FieldError message={errors.methodology?.message} />
                </div>

                <div>
                  <FieldLabel required>Methodology Type</FieldLabel>
                  <Controller
                    name="methodology_type"
                    control={control}
                    render={({ field }) => (
                      <ChipGroup
                        options={["Quantitative", "Qualitative", "Mixed"] as const}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                      />
                    )}
                  />
                </div>

                <div>
                  <FieldLabel required>Primary Source</FieldLabel>
                  <input
                    {...register("primary_source")}
                    placeholder="e.g. Peer-reviewed physiology journals"
                    className={inputClass(!!errors.primary_source)}
                  />
                  <FieldError message={errors.primary_source?.message} />
                </div>

                <div>
                  <FieldLabel required>Data Comfort</FieldLabel>
                  <input
                    {...register("data_comfort")}
                    placeholder="e.g. Statistical analysis, spreadsheet competency"
                    className={inputClass(!!errors.data_comfort)}
                  />
                  <FieldError message={errors.data_comfort?.message} />
                </div>
              </div>
            </div>

            {/* Section 5 — Student Profile */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-5">
              <SectionHeading>Section 5 — Student Profile</SectionHeading>

              <div className="space-y-5">
                <div>
                  <FieldLabel required>Recommended For</FieldLabel>
                  <textarea
                    {...register("recommended_for")}
                    rows={3}
                    placeholder="Describe the ideal student profile for this topic…"
                    className={textareaClass(!!errors.recommended_for)}
                  />
                  <FieldError message={errors.recommended_for?.message} />
                </div>

                <div>
                  <FieldLabel>Prerequisite Skills</FieldLabel>
                  <Controller
                    name="prerequisite_skills"
                    control={control}
                    render={({ field }) => (
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="e.g. Basic statistics…"
                      />
                    )}
                  />
                </div>

                <div>
                  <FieldLabel>Risk Flags</FieldLabel>
                  <Controller
                    name="risk_flags"
                    control={control}
                    render={({ field }) => (
                      <TagInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="e.g. Data collection time-intensive…"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {submitStatus === "error" && submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3">
                <p className="text-red-700 text-sm font-medium">{submitError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pb-8">
              <button
                type="button"
                onClick={handleSubmit((data) => submitTopic(data, "Draft"))}
                disabled={submitStatus === "submitting"}
                className="flex-1 py-3 rounded-lg text-sm font-semibold border border-navy text-navy hover:bg-navy/5 disabled:opacity-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={submitStatus === "submitting"}
                className="flex-1 py-3 rounded-lg text-sm font-bold bg-gold text-white hover:bg-gold/90 disabled:opacity-50 transition-colors"
                style={{ color: "#0B3C5D" }}
              >
                {submitStatus === "submitting" ? "Publishing…" : "Publish Topic"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
