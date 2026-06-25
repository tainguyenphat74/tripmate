import { PlusIcon } from "./icons";

/** Floating action button, anchored to the phone column above the bottom nav. */
export function Fab({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="absolute right-5 bottom-24 z-30 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-terra text-white shadow-[0_12px_26px_rgba(154,52,18,0.4)] transition-transform active:scale-95"
    >
      <PlusIcon size={26} />
    </button>
  );
}
