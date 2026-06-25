"use client";

import { useEffect } from "react";

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative max-h-[88dvh] w-full max-w-[440px] overflow-y-auto rounded-t-3xl bg-bg px-5 pt-3 pb-8 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
        <h2 className="mb-4 font-serif text-[22px] font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] outline-none focus:border-terra";
export const labelClass =
  "mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.08em] text-muted";
export const primaryBtn =
  "w-full rounded-xl bg-terra px-5 py-3.5 text-[15px] font-semibold text-white transition active:scale-[0.98] disabled:opacity-50";
