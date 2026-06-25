"use client";

import { useState, useTransition } from "react";
import { createTrip } from "@/lib/actions";
import { Sheet, inputClass, labelClass, primaryBtn } from "./Sheet";
import { ArrowRightIcon } from "./icons";

export function CreateTripDialog() {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // createTrip redirects on success.
    start(() => createTrip(fd));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-terra px-5 py-4 text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(154,52,18,0.3)] transition-transform active:scale-[0.98]"
      >
        Tạo chuyến đi mới
        <ArrowRightIcon size={18} />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Tạo chuyến đi mới">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Tên chuyến đi</label>
            <input
              name="name"
              required
              placeholder="Vd: Đà Nẵng 08/2026"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Thành viên</label>
            <textarea
              name="members"
              rows={3}
              placeholder="Mỗi người một dòng, vd:&#10;Phát&#10;An&#10;Bình"
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1.5 text-[12px] text-muted">
              Mỗi tên một dòng (hoặc cách nhau bằng dấu phẩy).
            </p>
          </div>
          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? "Đang tạo…" : "Tạo chuyến"}
          </button>
        </form>
      </Sheet>
    </>
  );
}
