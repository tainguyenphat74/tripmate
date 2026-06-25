import { mockTrip, mockTrips } from "./mock";
import { getSupabase, hasSupabase } from "./supabase";
import type { Trip } from "./types";

/**
 * Fetch a trip by its join code.
 * Falls back to the demo trip while Supabase env vars are not configured,
 * so the UI works locally and on first deploy before the DB is wired up.
 */
export async function getTrip(code: string): Promise<Trip | null> {
  if (!hasSupabase) {
    // Demo mode: show the matching sample trip (Đà Lạt or Vũng Tàu).
    return mockTrips[code] ?? mockTrip;
  }

  const sb = getSupabase()!;

  const { data: trip } = await sb
    .from("trips")
    .select("id, name, join_code, currency")
    .eq("join_code", code)
    .single();
  if (!trip) return null;

  const [membersRes, expensesRes, placesRes] = await Promise.all([
    sb.from("members").select("id, name").eq("trip_id", trip.id),
    sb
      .from("expenses")
      .select("id, payer_id, description, amount, split_type")
      .eq("trip_id", trip.id)
      .order("created_at", { ascending: false }),
    sb
      .from("places")
      .select("id, name, note, url, visited")
      .eq("trip_id", trip.id)
      .order("position", { ascending: true }),
  ]);

  const expenseRows = expensesRes.data ?? [];
  const expenseIds = expenseRows.map((e) => e.id);
  const { data: shareRows } = expenseIds.length
    ? await sb
        .from("expense_shares")
        .select("expense_id, member_id, amount")
        .in("expense_id", expenseIds)
    : { data: [] as { expense_id: string; member_id: string; amount: number }[] };

  return {
    code: trip.join_code,
    name: trip.name,
    currency: trip.currency,
    members: (membersRes.data ?? []).map((m) => ({ id: m.id, name: m.name })),
    expenses: expenseRows.map((e) => ({
      id: e.id,
      payerId: e.payer_id,
      description: e.description,
      amount: e.amount,
      splitType: e.split_type,
      shares: (shareRows ?? [])
        .filter((s) => s.expense_id === e.id)
        .map((s) => ({ memberId: s.member_id, amount: s.amount })),
    })),
    places: (placesRes.data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      note: p.note ?? undefined,
      url: p.url ?? undefined,
      visited: p.visited,
    })),
  };
}
