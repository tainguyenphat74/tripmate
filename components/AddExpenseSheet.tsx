"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addExpense } from "@/lib/actions";
import { Sheet, inputClass, labelClass, primaryBtn } from "./Sheet";
import { PlusIcon } from "./icons";
import type { Member } from "@/lib/types";

export function AddExpenseSheet({
  tripId,
  code,
  members,
  defaultPayerId,
}: {
  tripId: string;
  code: string;
  members: Member[];
  defaultPayerId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [split, setSplit] = useState<"even" | "exact">("even");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const memberIds = members.map((m) => m.id).join(",");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      try {
        await addExpense(fd);
        router.refresh();
        setOpen(false);
        setSplit("even");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Thêm khoản chi"
        onClick={() => setOpen(true)}
        className="absolute right-5 bottom-24 z-30 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-terra text-white shadow-[0_12px_26px_rgba(154,52,18,0.4)] transition-transform active:scale-95"
      >
        <PlusIcon size={26} />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Thêm khoản chi">
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="tripId" value={tripId} />
          <input type="hidden" name="code" value={code} />
          <input type="hidden" name="memberIds" value={memberIds} />
          <input type="hidden" name="splitType" value={split} />

          <div>
            <label className={labelClass}>Mô tả</label>
            <input
              name="description"
              required
              placeholder="Vd: Ăn trưa, vé xe…"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Người trả</label>
            <select
              name="payerId"
              defaultValue={defaultPayerId}
              className={inputClass}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Split mode toggle */}
          <div className="grid grid-cols-2 gap-2">
            {(["even", "exact"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSplit(mode)}
                className={`rounded-xl border px-3 py-2.5 text-[13px] font-semibold ${
                  split === mode
                    ? "border-terra bg-terra text-white"
                    : "border-line bg-card text-muted"
                }`}
              >
                {mode === "even" ? "Chia đều" : "Nhập cụ thể"}
              </button>
            ))}
          </div>

          {split === "even" ? (
            <>
              <div>
                <label className={labelClass}>Số tiền (VND)</label>
                <input
                  name="amount"
                  inputMode="numeric"
                  required
                  placeholder="Vd: 500000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Chia cho ai</label>
                <div className="space-y-1.5">
                  {members.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-2.5"
                    >
                      <input
                        type="checkbox"
                        name={`part_${m.id}`}
                        defaultChecked
                        className="h-4 w-4 accent-[#9a3412]"
                      />
                      <span className="text-[14px]">{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className={labelClass}>Số tiền từng người (VND)</label>
              <div className="space-y-1.5">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-2"
                  >
                    <span className="w-16 flex-shrink-0 text-[14px]">
                      {m.name}
                    </span>
                    <input
                      name={`share_${m.id}`}
                      inputMode="numeric"
                      placeholder="0"
                      className="min-w-0 flex-1 bg-transparent py-1 text-right text-[14px] outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-[13px] text-terra">{error}</p>}

          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? "Đang lưu…" : "Lưu khoản chi"}
          </button>
        </form>
      </Sheet>
    </>
  );
}
