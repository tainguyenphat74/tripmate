import { notFound } from "next/navigation";
import { TripHeader } from "@/components/TripHeader";
import { AddPlaceSheet } from "@/components/AddPlaceSheet";
import { PlaceToggle } from "@/components/PlaceToggle";
import { MapPinIcon } from "@/components/icons";
import { getTrip } from "@/lib/data";

function mapsHref(name: string, url?: string): string {
  return (
    url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
  );
}

export default async function PlacesPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const trip = await getTrip(code);
  if (!trip) notFound();
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
              <PlaceToggle placeId={p.id} code={trip.code} visited={p.visited} />
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
              <a
                href={mapsHref(p.name, p.url)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Mở "${p.name}" trong Google Maps`}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line text-terra transition-colors hover:bg-terra hover:text-white"
              >
                <MapPinIcon size={17} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <AddPlaceSheet tripId={trip.id} code={trip.code} />
    </>
  );
}
