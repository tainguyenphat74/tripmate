"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { addSettlement } from "@/lib/actions";
import { CheckIcon } from "./icons";

export function SettleButton({
  tripId,
  code,
  fromId,
  toId,
  amount,
}: {
  tripId: string;
  code: string;
  fromId: string;
  toId: string;
  amount: number;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function settle() {
    const fd = new FormData();
    fd.set("tripId", tripId);
    fd.set("code", code);
    fd.set("fromId", fromId);
    fd.set("toId", toId);
    fd.set("amount", String(amount));
    start(async () => {
      await addSettlement(fd);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={settle}
      disabled={pending}
      className="flex items-center gap-1.5 rounded-full border border-terra px-3 py-1.5 text-[12px] font-semibold text-terra transition-colors hover:bg-terra hover:text-white disabled:opacity-50"
    >
      <CheckIcon size={14} />
      {pending ? "…" : "Đã trả"}
    </button>
  );
}
