import { NextRequest } from "next/server";

type Suggestion = {
  name: string;
  label: string;
  mapsUrl: string;
};

/** Build a Google Maps "search" deep link from coordinates (precise) or a name. */
function mapsUrl(lat: number | null, lon: number | null, name: string): string {
  if (lat != null && lon != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
}

/**
 * Location autocomplete via Photon (free, OpenStreetMap-based, no API key).
 * Proxied server-side to avoid CORS and to bias results toward Vietnam.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return Response.json([] as Suggestion[]);

  const url =
    "https://photon.komoot.io/api/?" +
    new URLSearchParams({
      q,
      limit: "6",
      lang: "default",
      lat: "16.05", // bias toward Vietnam
      lon: "108.2",
    });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "TripMate/1.0 (personal trip app)" },
      // Cache identical queries briefly to be kind to the free service.
      next: { revalidate: 86400 },
    });
    if (!res.ok) return Response.json([] as Suggestion[]);
    const data = (await res.json()) as {
      features?: {
        properties?: Record<string, string>;
        geometry?: { coordinates?: [number, number] };
      }[];
    };

    const seen = new Set<string>();
    const results: Suggestion[] = [];
    for (const f of data.features ?? []) {
      const p = f.properties ?? {};
      const [lon, lat] = f.geometry?.coordinates ?? [null, null];
      const name = p.name || p.street || q;
      const parts = [
        p.name,
        p.street,
        p.district,
        p.city,
        p.state,
        p.country,
      ].filter(Boolean) as string[];
      const label = Array.from(new Set(parts)).join(", ");
      if (seen.has(label)) continue;
      seen.add(label);
      results.push({ name, label, mapsUrl: mapsUrl(lat, lon, name) });
    }
    return Response.json(results);
  } catch {
    return Response.json([] as Suggestion[]);
  }
}
