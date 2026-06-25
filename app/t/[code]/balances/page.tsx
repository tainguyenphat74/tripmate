import { notFound } from "next/navigation";
import { TripHeader } from "@/components/TripHeader";
import { Avatar } from "@/components/Avatar";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { getTrip } from "@/lib/data";
import { computeBalances, settleUp } from "@/lib/settle";
import { formatVND, formatSignedVND } from "@/lib/format";

export default async function BalancesPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const trip = await getTrip(code);
  if (!trip) notFound();
  const name = (id: string) =>
    trip.members.find((m) => m.id === id)?.name ?? "?";

  const balances = computeBalances(trip.members, trip.expenses);
  const transfers = settleUp(balances);
  const sorted = [...balances].sort((a, b) => b.net - a.net);

  return (
    <>
      <TripHeader
        name={trip.name}
        subtitle={`${trip.members.length} thành viên · ${trip.expenses.length} khoản chi`}
      />

      <div className="px-6 pb-28">
        {/* Per-member balances */}
        <h2 className="mt-5 mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Số dư từng người
        </h2>
        <ul>
          {sorted.map((b) => (
            <li
              key={b.memberId}
              className="flex items-center gap-3 border-b border-line py-3"
            >
              <Avatar id={b.memberId} name={name(b.memberId)} size={40} />
              <div className="min-w-0 flex-1">
                <div className="font-serif text-[16px] font-semibold">
                  {name(b.memberId)}
                </div>
                <div className="text-[12px] text-muted">
                  {b.net > 0
                    ? "được nhận lại"
                    : b.net < 0
                      ? "còn phải trả"
                      : "đã cân bằng"}
                </div>
              </div>
              <div
                className={`tnum text-[15px] font-semibold ${
                  b.net > 0 ? "text-pos" : b.net < 0 ? "text-neg" : "text-muted"
                }`}
              >
                {formatSignedVND(b.net)}
              </div>
            </li>
          ))}
        </ul>

        {/* Settle-up suggestions */}
        <h2 className="mt-7 mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Gợi ý thanh toán
        </h2>
        <p className="mb-3 text-[12.5px] text-muted">
          {transfers.length} giao dịch để quyết toán gọn nhất.
        </p>
        <ul className="space-y-2.5">
          {transfers.map((t, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5"
            >
              <Avatar id={t.fromId} name={name(t.fromId)} size={36} />
              <ArrowRightIcon size={16} className="text-muted" />
              <Avatar id={t.toId} name={name(t.toId)} size={36} />
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px]">
                  <span className="font-semibold">{name(t.fromId)}</span> trả{" "}
                  <span className="font-semibold">{name(t.toId)}</span>
                </div>
                <div className="tnum text-[12.5px] font-semibold text-terra">
                  {formatVND(t.amount)}
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-terra px-3 py-1.5 text-[12px] font-semibold text-terra transition-colors hover:bg-terra hover:text-white"
              >
                <CheckIcon size={14} />
                Đã trả
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
