"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addPlace } from "@/lib/actions";
import { Sheet, inputClass, labelClass, primaryBtn } from "./Sheet";
import { PlusIcon, MapPinIcon } from "./icons";

type Suggestion = { name: string; label: string; mapsUrl: string };

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

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const skipNext = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced location autocomplete.
  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    const q = name.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places-search?q=${encodeURIComponent(q)}`,
        );
        setSuggestions(res.ok ? await res.json() : []);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [name]);

  function pick(s: Suggestion) {
    skipNext.current = true; // don't re-search after programmatic set
    setName(s.name);
    setUrl(s.mapsUrl);
    setSuggestions([]);
  }

  function reset() {
    setName("");
    setUrl("");
    setSuggestions([]);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      await addPlace(fd);
      router.refresh();
      setOpen(false);
      reset();
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
          <input type="hidden" name="url" value={url} />

          <div className="relative">
            <label className={labelClass}>Tên địa điểm</label>
            <input
              name="name"
              required
              autoComplete="off"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setUrl(""); // manual edit clears the picked location
              }}
              placeholder="Gõ để tìm: Bãi Sau, Hồ Tuyền Lâm…"
              className={inputClass}
            />
            {url && (
              <p className="mt-1.5 flex items-center gap-1 text-[12px] text-pos">
                <MapPinIcon size={13} /> Đã gắn vị trí trên bản đồ
              </p>
            )}

            {(searching || suggestions.length > 0) && (
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-line bg-card shadow-lg">
                {searching && suggestions.length === 0 && (
                  <li className="px-4 py-2.5 text-[13px] text-muted">
                    Đang tìm…
                  </li>
                )}
                {suggestions.map((s, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => pick(s)}
                      className="flex w-full items-start gap-2 px-4 py-2.5 text-left hover:bg-bg"
                    >
                      <MapPinIcon
                        size={15}
                        className="mt-0.5 flex-shrink-0 text-terra"
                      />
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium">
                          {s.name}
                        </span>
                        <span className="block truncate text-[12px] text-muted">
                          {s.label}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className={labelClass}>Ghi chú (tuỳ chọn)</label>
            <input
              name="note"
              placeholder="Vd: Đi buổi sáng sớm"
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
