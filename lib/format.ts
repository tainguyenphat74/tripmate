/** Format an integer VND amount as e.g. "2.400.000đ". */
export function formatVND(amount: number): string {
  return `${Math.round(amount).toLocaleString("vi-VN")}đ`;
}

/** Signed amount, e.g. "+250.000đ" / "−80.000đ". */
export function formatSignedVND(amount: number): string {
  const sign = amount > 0 ? "+" : amount < 0 ? "−" : "";
  return `${sign}${formatVND(Math.abs(amount))}`;
}

/** Two uppercase initials-ish letters for an avatar. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1] ?? name;
  return last.charAt(0).toUpperCase();
}
