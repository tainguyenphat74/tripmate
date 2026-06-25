import { PlaneIcon, ShareIcon } from "./icons";

export function TripHeader({
  name,
  subtitle,
}: {
  name: string;
  subtitle: string;
}) {
  return (
    <header className="flex items-start justify-between px-6 pt-13 pb-1">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-terra">
          <PlaneIcon size={13} /> Chuyến đi
        </div>
        <h1 className="mt-2.5 font-serif text-[33px] font-semibold leading-[1.05] tracking-tight">
          {name}
        </h1>
        <p className="mt-2 text-[12.5px] font-medium text-muted">{subtitle}</p>
      </div>
      <button
        type="button"
        aria-label="Chia sẻ chuyến đi"
        className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-terra text-terra transition-colors hover:bg-terra hover:text-white"
      >
        <ShareIcon size={18} />
      </button>
    </header>
  );
}
