import { initials } from "@/lib/format";

// Deterministic warm palette so each member keeps the same colour.
const COLORS = ["#9A3412", "#B45309", "#15803D", "#1D4ED8", "#7C3AED", "#BE185D"];

function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

export function Avatar({
  id,
  name,
  size = 44,
  rounded = "rounded-full",
}: {
  id: string;
  name: string;
  size?: number;
  rounded?: string;
}) {
  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center font-serif font-semibold text-white ${rounded}`}
      style={{
        width: size,
        height: size,
        background: colorFor(id),
        fontSize: size * 0.38,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
