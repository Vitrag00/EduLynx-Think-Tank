"use client";
import React from "react";

interface ScorePillProps {
  score: number;
  type: "feasibility" | "innovation";
}

export function ScorePill({ score, type }: ScorePillProps) {
  const isFeasibility = type === "feasibility";
  const barColor = isFeasibility ? "bg-blue-500" : "bg-gold";
  const textColor = isFeasibility ? "text-blue-700" : "text-amber-700";
  const bgColor = isFeasibility ? "bg-blue-50" : "bg-amber-50";
  const label = isFeasibility ? "Feasibility" : "Innovation";
  const barWidth = `${score * 10}%`;

  return (
    <div className={`flex flex-col gap-0.5 px-2 py-1.5 rounded ${bgColor}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-medium text-charcoal/60 uppercase tracking-wide">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{score}/10</span>
      </div>
      <div className="w-full h-1 bg-white/70 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all`}
          style={{ width: barWidth }}
        />
      </div>
    </div>
  );
}
