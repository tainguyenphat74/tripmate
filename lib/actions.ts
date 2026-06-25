"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase } from "./supabase";
import { evenSplit } from "./settle";

function db() {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase chưa được cấu hình.");
  return sb;
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? "";
}

function intVal(fd: FormData, key: string): number {
  // Accept "1.200.000", "1,200,000", "1200000" → 1200000
  const raw = str(fd, key).replace(/[^\d]/g, "");
  return raw ? parseInt(raw, 10) : 0;
}

function randomCode(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${slug || "chuyen-di"}-${rand}`;
}

/** Create a new trip with its members, then go to it. */
export async function createTrip(fd: FormData) {
  const sb = db();
  const name = str(fd, "name") || "Chuyến đi mới";
  const memberNames = str(fd, "members")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const code = randomCode(name);
  const { data: trip, error } = await sb
    .from("trips")
    .insert({ name, join_code: code, currency: "VND" })
    .select("id, join_code")
    .single();
  if (error || !trip) throw new Error(error?.message ?? "Không tạo được chuyến.");

  if (memberNames.length) {
    await sb
      .from("members")
      .insert(memberNames.map((n) => ({ trip_id: trip.id, name: n })));
  }

  redirect(`/t/${trip.join_code}`);
}

/** Add an expense (even or exact split) with its shares. */
export async function addExpense(fd: FormData) {
  const sb = db();
  const tripId = str(fd, "tripId");
  const code = str(fd, "code");
  const description = str(fd, "description") || "Khoản chi";
  const payerId = str(fd, "payerId");
  const splitType = str(fd, "splitType") === "exact" ? "exact" : "even";
  const memberIds = str(fd, "memberIds").split(",").filter(Boolean);

  let amount = 0;
  let shares: { memberId: string; amount: number }[] = [];

  if (splitType === "exact") {
    shares = memberIds
      .map((id) => ({ memberId: id, amount: intVal(fd, `share_${id}`) }))
      .filter((s) => s.amount > 0);
    amount = shares.reduce((sum, s) => sum + s.amount, 0);
  } else {
    amount = intVal(fd, "amount");
    const participants = memberIds.filter(
      (id) => fd.get(`part_${id}`) === "on",
    );
    const list = participants.length ? participants : memberIds;
    shares = evenSplit(amount, list, payerId);
  }

  if (!payerId || amount <= 0 || shares.length === 0) {
    throw new Error("Thiếu thông tin khoản chi.");
  }

  const { data: expense, error } = await sb
    .from("expenses")
    .insert({
      trip_id: tripId,
      payer_id: payerId,
      description,
      amount,
      split_type: splitType,
    })
    .select("id")
    .single();
  if (error || !expense) throw new Error(error?.message ?? "Không lưu được khoản chi.");

  await sb.from("expense_shares").insert(
    shares.map((s) => ({
      expense_id: expense.id,
      member_id: s.memberId,
      amount: s.amount,
    })),
  );

  revalidatePath(`/t/${code}`);
  revalidatePath(`/t/${code}/balances`);
}

/** Add a place to the trip's list. */
export async function addPlace(fd: FormData) {
  const sb = db();
  const tripId = str(fd, "tripId");
  const code = str(fd, "code");
  const name = str(fd, "name");
  if (!name) throw new Error("Thiếu tên địa điểm.");

  const { count } = await sb
    .from("places")
    .select("id", { count: "exact", head: true })
    .eq("trip_id", tripId);

  await sb.from("places").insert({
    trip_id: tripId,
    name,
    note: str(fd, "note") || null,
    url: str(fd, "url") || null,
    visited: false,
    position: count ?? 0,
  });

  revalidatePath(`/t/${code}/places`);
}

/** Toggle a place's visited state. */
export async function togglePlaceVisited(fd: FormData) {
  const sb = db();
  const id = str(fd, "placeId");
  const code = str(fd, "code");
  const visited = fd.get("visited") === "true";
  await sb.from("places").update({ visited }).eq("id", id);
  revalidatePath(`/t/${code}/places`);
}

/** Record a settlement (from → to) marking a suggested transfer as paid. */
export async function addSettlement(fd: FormData) {
  const sb = db();
  const tripId = str(fd, "tripId");
  const code = str(fd, "code");
  await sb.from("settlements").insert({
    trip_id: tripId,
    from_id: str(fd, "fromId"),
    to_id: str(fd, "toId"),
    amount: intVal(fd, "amount"),
  });
  revalidatePath(`/t/${code}/balances`);
}
