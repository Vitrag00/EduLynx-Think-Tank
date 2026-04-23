"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDrawerStore, useShortlistStore, useCompareStore } from "@/store/filterStore";
import { Badge } from "@/components/ui/Badge";
import type { Topic } from "@/types/topic";

interface TopicDrawerProps {
  topics: Topic[];
}

export function TopicDrawer({ topics }: TopicDrawerProps) {
  const { isOpen, selectedTopicId, closeDrawer } = useDrawerStore();
  const { toggleShortlist, isShortlisted } = useShortlistStore();
  const { compareIds, addToCompare, removeFromCompare } = useCompareStore();

  const topic = topics.find((t) => t.id === selectedTopicId) ?? null;

  const shortlisted = topic ? isShortlisted(topic.id) : false;
  const inCompare = topic ? compareIds.includes(topic.id) : false;

  const bandVariant = topic
    ? topic.targetBand.includes(7)
      ? "band-7"
      : topic.targetBand.includes(6)
      ? "band-6"
      : "band-5"
    : "band-5";

  const bandLabel = topic
    ? topic.targetBand.includes(7)
      ? "Band 7"
      : topic.targetBand.includes(6)
      ? "Band 6"
      : "Band 5"
    : "Band 5";

  return (
    <AnimatePresence>
      {isOpen && topic && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-navy-deeper/60 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-[560px] max-w-full z-50 flex flex-col shadow-2xl"
            style={{ background: "#fff" }}
          >
            {/* Header */}
            <div className="px-6 py-5 flex flex-col gap-3" style={{ background: "#1e2a3a" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    label={topic.level}
                    variant={topic.level === "SL" ? "level-sl" : "level-hl"}
                  />
                  <Badge
                    label={topic.serviceType}
                    variant={topic.serviceType === "IA" ? "stream-IA" : "stream-EE"}
                  />
                  <Badge label={bandLabel} variant={bandVariant} />
                  <Badge
                    label={topic.inventoryType}
                    variant={topic.inventoryType === "Pre-Built" ? "pre-built" : "custom"}
                  />
                </div>
                <button
                  onClick={closeDrawer}
                  className="text-white/50 hover:text-white text-xl leading-none shrink-0 transition-colors"
                  aria-label="Close drawer"
                >
                  ×
                </button>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">
                  {topic.subjectGroup} · {topic.subject}
                </p>
                <h2 className="text-white font-bold text-xl leading-snug font-serif">
                  {topic.topicTitle}
                </h2>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-warm">
              {/* Draft RQ */}
              <section>
                <h4 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-2">
                  Draft Research Question
                </h4>
                <div
                  className="bg-navy-deeper/90 rounded-lg px-4 py-3"
                  style={{ borderLeft: "4px solid #C9A24D" }}
                >
                  <p className="text-white/90 text-sm leading-relaxed italic">{topic.draftRQ}</p>
                </div>
              </section>

              {/* Scores */}
              <section>
                <h4 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-2">
                  Assessment Scores
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <ScoreBlock label="Feasibility" score={topic.feasibility} color="#2563eb" />
                  <ScoreBlock label="Innovation" score={topic.innovation} color="#C9A24D" />
                </div>
              </section>

              {/* Why It Works */}
              <section>
                <h4 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-2">
                  Why It Works
                </h4>
                <div className="bg-white border border-[#e2e8f0] rounded-lg px-4 py-3">
                  <p className="text-sm text-charcoal/80 leading-relaxed">{topic.whyItWorks}</p>
                </div>
              </section>

              {/* Methodology */}
              <section>
                <h4 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-2">
                  Methodology
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <InfoCell label="Approach" value={topic.methodology} />
                  <InfoCell label="Type" value={topic.methodologyType} />
                  <InfoCell label="Data Availability" value={topic.dataAvailability} />
                  <InfoCell label="Data Comfort" value={topic.dataComfort} />
                </div>
              </section>

              {/* Key Theory */}
              <section>
                <h4 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-2">
                  Key Theory & Concepts
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {topic.keyTheory.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-navy text-white text-xs rounded-full font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>

              {/* Recommended For */}
              <section>
                <h4 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-2">
                  Recommended For
                </h4>
                <p className="text-sm text-charcoal/80 mb-2">{topic.recommendedFor}</p>
                <div className="flex flex-wrap gap-1.5">
                  {topic.prerequisiteSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-green-50 text-green-800 border border-green-200 text-xs rounded-full font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              {/* Risk Flags */}
              {topic.riskFlags.length > 0 && (
                <section>
                  <h4 className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-2">
                    Risk Flags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.riskFlags.map((r) => (
                      <span
                        key={r}
                        className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-xs rounded-full font-medium"
                      >
                        ⚠ {r}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Est. Hours */}
              <section>
                <div className="flex items-center gap-2 text-sm text-charcoal/60">
                  <span className="font-semibold text-charcoal">Estimated Hours:</span>
                  <span>{topic.estimatedHours}h</span>
                  <span className="mx-2 text-charcoal/20">|</span>
                  <span className="font-semibold text-charcoal">Complexity:</span>
                  <span>{topic.complexity}</span>
                </div>
              </section>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-[#e2e8f0] bg-white flex items-center gap-2">
              <button
                onClick={() => topic && toggleShortlist(topic.id)}
                className={`flex-1 py-2 rounded text-sm font-semibold border transition-colors ${
                  shortlisted
                    ? "bg-gold text-white border-gold"
                    : "bg-navy text-white border-navy hover:bg-navy-light"
                }`}
              >
                {shortlisted ? "★ Shortlisted" : "☆ Shortlist"}
              </button>
              <button
                onClick={() =>
                  topic && (inCompare ? removeFromCompare(topic.id) : addToCompare(topic.id))
                }
                className="flex-1 py-2 rounded text-sm font-semibold border border-navy text-navy hover:bg-navy/5 transition-colors"
              >
                {inCompare ? "✓ In Compare" : "Compare"}
              </button>
              <button className="flex-1 py-2 rounded text-sm font-semibold bg-gold text-white hover:bg-gold-light transition-colors">
                Request Guidance →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ScoreBlock({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg px-4 py-3 text-center">
      <p className="text-2xl font-bold" style={{ color }}>
        {score}
        <span className="text-sm font-normal text-charcoal/40">/10</span>
      </p>
      <p className="text-xs text-charcoal/60 mt-1 uppercase tracking-wide">{label}</p>
      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${score * 10}%`, background: color }}
        />
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded px-3 py-2">
      <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xs text-charcoal/80">{value}</p>
    </div>
  );
}
