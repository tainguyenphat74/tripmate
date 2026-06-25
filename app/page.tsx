import Link from "next/link";
import { PlaneIcon, ArrowRightIcon } from "@/components/icons";
import { mockTrip } from "@/lib/mock";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col px-7 pt-20 pb-10">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-terra">
        <PlaneIcon size={13} /> TripMate
      </div>

      <h1 className="mt-4 font-serif text-[42px] leading-[1.05] font-semibold tracking-tight">
        Chia tiền chuyến đi, nhẹ như xách balo.
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Ghi khoản chi, xem ai nợ ai, và lên danh sách địa điểm cho cả nhóm — chỉ
        cần một đường link, không cần đăng nhập.
      </p>

      <div className="mt-9 space-y-3">
        <Link
          href={`/t/${mockTrip.code}`}
          className="flex items-center justify-center gap-2 rounded-2xl bg-terra px-5 py-4 text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(154,52,18,0.3)] transition-transform active:scale-[0.98]"
        >
          Tạo chuyến đi mới
          <ArrowRightIcon size={18} />
        </Link>

        <div className="rounded-2xl border border-line bg-card p-2 pl-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="text"
              placeholder="Dán mã hoặc link chuyến đi…"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[14px] outline-none placeholder:text-muted"
            />
            <Link
              href={`/t/${mockTrip.code}`}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-terra-soft text-terra"
              aria-label="Mở chuyến đi"
            >
              <ArrowRightIcon size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-10 text-center text-[12px] text-muted">
        Ví dụ:{" "}
        <Link href={`/t/${mockTrip.code}`} className="font-semibold text-terra">
          {mockTrip.name}
        </Link>
      </div>
    </main>
  );
}
