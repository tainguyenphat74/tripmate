import type { Expense, Member } from "./types";

export type Balance = {
  memberId: string;
  net: number; // > 0 = owed money back, < 0 = still owes
};

export type Transfer = {
  fromId: string; // who pays
  toId: string; // who receives
  amount: number;
};

/** Net balance per member = total paid − total share owed. */
export function computeBalances(
  members: Member[],
  expenses: Expense[],
): Balance[] {
  const net = new Map<string, number>();
  for (const m of members) net.set(m.id, 0);

  for (const e of expenses) {
    net.set(e.payerId, (net.get(e.payerId) ?? 0) + e.amount);
    for (const s of e.shares) {
      net.set(s.memberId, (net.get(s.memberId) ?? 0) - s.amount);
    }
  }

  return members.map((m) => ({ memberId: m.id, net: net.get(m.id) ?? 0 }));
}

/**
 * Greedy minimal cash-flow settlement: repeatedly match the biggest creditor
 * with the biggest debtor. Produces a near-minimal number of transfers.
 */
export function settleUp(balances: Balance[]): Transfer[] {
  const creditors = balances
    .filter((b) => b.net > 0)
    .map((b) => ({ id: b.memberId, amount: b.net }))
    .sort((a, b) => b.amount - a.amount);
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ id: b.memberId, amount: -b.net }))
    .sort((a, b) => b.amount - a.amount);

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;
  while (i < creditors.length && j < debtors.length) {
    const give = Math.min(creditors[i].amount, debtors[j].amount);
    if (give > 0) {
      transfers.push({
        fromId: debtors[j].id,
        toId: creditors[i].id,
        amount: give,
      });
    }
    creditors[i].amount -= give;
    debtors[j].amount -= give;
    if (creditors[i].amount <= 0) i++;
    if (debtors[j].amount <= 0) j++;
  }
  return transfers;
}

/** Even split with the rounding remainder assigned to the payer. */
export function evenSplit(
  amount: number,
  memberIds: string[],
  payerId: string,
): { memberId: string; amount: number }[] {
  const n = memberIds.length;
  if (n === 0) return [];
  const base = Math.floor(amount / n);
  const remainder = amount - base * n;
  return memberIds.map((id) => ({
    memberId: id,
    amount: id === payerId ? base + remainder : base,
  }));
}
