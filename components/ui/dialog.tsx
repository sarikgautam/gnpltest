"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, children }: any) {
  return (
    open && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      >
        <div
          className="relative z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  );
}

export function DialogContent({ className, children }: any) {
  return (
    <div
      className={cn(
        "w-full max-w-lg p-6 bg-[#0f0f0f] text-white rounded-2xl border border-white/20 shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children }: any) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: any) {
  return <h2 className="text-xl font-semibold text-green-400">{children}</h2>;
}
