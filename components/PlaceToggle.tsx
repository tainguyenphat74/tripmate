"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePlaceVisited } from "@/lib/actions";
import { CheckIcon } from "./icons";

export function PlaceToggle({
  placeId,
  code,
  visited,
}: {
  placeId: string;
  code: string;
  visited: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function toggle() {
    const fd = new FormData();
    fd.set("placeId", placeId);
    fd.set("code", code);
    fd.set("visited", String(!visited));
    start(async () => {
      await togglePlaceVisited(fd);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={visited ? "Bỏ đánh dấu đã đi" : "Đánh dấu đã đi"}
      aria-pressed={visited}
      disabled={pending}
      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
        visited
          ? "border-terra bg-terra text-white"
          : "border-line text-transparent hover:border-terra"
      } ${pending ? "opacity-50" : ""}`}
    >
      <CheckIcon size={15} />
    </button>
  );
}
