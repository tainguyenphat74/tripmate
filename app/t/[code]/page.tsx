import { notFound } from "next/navigation";
import { TripHeader } from "@/components/TripHeader";
import { AddExpenseSheet } from "@/components/AddExpenseSheet";
import { getTrip } from "@/lib/data";
import { CURRENT_MEMBER_ID } from "@/lib/mock";
import { computeBalances } from "@/lib/settle";
import { formatVND, formatSignedVND } from "@/lib/format";

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const trip = await getTrip(code);
  if (!trip) notFound();
  const me = CURRENT_MEMBER_ID;
  const memberName = (id: string) =>
    trip.members.find((m) => m.id === id)?.name ?? "?";

  const balances = computeBalances(
    trip.members,
    trip.expenses,
    trip.settlements,
  );
  const myNet = balances.find((b) => b.memberId === me)?.net ?? 0;

  return (
    <>
      <TripHeader
        name={trip.name}
        subtitle={`${trip.members.length} thành viên · ${trip.expenses.length} khoản chi`}
      />

      {/* Balance card with route */}
      <div className="mx-6 mt-4 flex items-center justify-between rounded-[20px] border border-line bg-card px-5 py-4 shadow-[0_10px_26px_rgba(154,52,18,0.07)]">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {myNet >= 0 ? "Bạn được nhận lại" : "Bạn còn phải trả"}
          </div>
          <div
            className={`mt-0.5 font-serif text-[30px] font-semibold ${
              myNet >= 0 ? "text-pos" : "text-neg"
            }`}
          >
            {formatSignedVND(myNet)}
          </div>
        </div>
        <div className="text-right text-[12px] font-semibold leading-[1.5] text-muted">
          SGN
          <br />
          <span className="font-serif text-[15px] text-fg">→</span>
          <br />
          DLI
        </div>
      </div>

      {/* Expense list */}
      <section className="px-6 pt-2 pb-28">
        <h2 className="mt-[18px] mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Khoản chi gần đây
        </h2>
        <ul>
          {trip.expenses.map((e, i) => {
            const myShare =
              e.shares.find((s) => s.memberId === me)?.amount ?? 0;
            const iPaid = e.payerId === me;
            const splitLabel =
              e.splitType === "even" ? "chia đều" : "chia cụ thể";
            return (
              <li
                key={e.id}
                className="flex items-baseline gap-3.5 border-b border-line py-[15px]"
              >
                <span className="w-[22px] flex-shrink-0 font-serif text-[16px] font-semibold text-terra">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-[18px] font-semibold">
                    {e.description}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-muted">
                    {memberName(e.payerId)} trả · {splitLabel} ·{" "}
                    {iPaid ? (
                      <span className="font-semibold text-pos">bạn đã ứng</span>
                    ) : (
                      <span className="font-semibold text-terra">
                        bạn nợ {formatVND(myShare)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="tnum text-[15px] font-semibold whitespace-nowrap">
                  {formatVND(e.amount)}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <AddExpenseSheet
        tripId={trip.id}
        code={trip.code}
        members={trip.members}
        defaultPayerId={trip.members[0]?.id ?? ""}
      />
    </>
  );
}
