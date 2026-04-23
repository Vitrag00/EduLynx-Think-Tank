"use client";
import React from "react";

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white border border-[#e2e8f0] rounded-lg p-4 animate-pulse">
          <div className="h-1 w-full bg-gray-200 rounded mb-4" />
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-10 bg-gray-200 rounded" />
            <div className="h-5 w-10 bg-gray-200 rounded" />
            <div className="h-5 w-12 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-gray-200 rounded mb-1" />
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-3" />
          <div className="h-3 w-full bg-gray-200 rounded mb-1" />
          <div className="h-3 w-5/6 bg-gray-200 rounded mb-4" />
          <div className="flex gap-2">
            <div className="h-7 flex-1 bg-gray-200 rounded" />
            <div className="h-7 flex-1 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
