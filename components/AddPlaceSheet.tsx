"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addPlace } from "@/lib/actions";
import { Sheet, inputClass, labelClass, primaryBtn } from "./Sheet";
import { PlusIcon } from "./icons";

export function AddPlaceSheet({
  tripId,
  code,
}: {
  tripId: string;
  code: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      await addPlace(fd);
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Thêm địa điểm"
        onClick={() => setOpen(true)}
        className="absolute right-5 bottom-24 z-30 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-terra text-white shadow-[0_12px_26px_rgba(154,52,18,0.4)] transition-transform active:scale-95"
      >
        <PlusIcon size={26} />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Thêm địa điểm">
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="tripId" value={tripId} />
          <input type="hidden" name="code" value={code} />
          <div>
            <label className={labelClass}>Tên địa điểm</label>
            <input
              name="name"
              required
              placeholder="Vd: Bãi Sau, Hồ Tuyền Lâm…"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Ghi chú (tuỳ chọn)</label>
            <input
              name="note"
              placeholder="Vd: Đi buổi sáng sớm"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Link bản đồ (tuỳ chọn)</label>
            <input
              name="url"
              inputMode="url"
              placeholder="https://maps.google.com/…"
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? "Đang lưu…" : "Thêm địa điểm"}
          </button>
        </form>
      </Sheet>
    </>
  );
}
