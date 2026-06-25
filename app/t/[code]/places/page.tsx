import { TripHeader } from "@/components/TripHeader";
import { Fab } from "@/components/Fab";
import { CheckIcon } from "@/components/icons";
import { mockTrip } from "@/lib/mock";

export default function PlacesPage() {
  const trip = mockTrip;
  const visitedCount = trip.places.filter((p) => p.visited).length;

  return (
    <>
      <TripHeader
        name={trip.name}
        subtitle={`${trip.members.length} thành viên · ${trip.places.length} địa điểm`}
      />

      <section className="px-6 pt-2 pb-28">
        <div className="mt-[18px] mb-1.5 flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Địa điểm muốn đi
          </h2>
          <span className="text-[12px] font-semibold text-terra">
            {visitedCount}/{trip.places.length} đã đi
          </span>
        </div>

        <ul>
          {trip.places.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3.5 border-b border-line py-[15px]"
            >
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                  p.visited
                    ? "border-terra bg-terra text-white"
                    : "border-line text-transparent"
                }`}
                aria-hidden
              >
                <CheckIcon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className={`font-serif text-[18px] font-semibold ${
                    p.visited ? "text-muted line-through" : ""
                  }`}
                >
                  {p.name}
                </div>
                {p.note && (
                  <div className="mt-0.5 text-[12.5px] text-muted">{p.note}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Fab label="Thêm địa điểm" />
    </>
  );
}
