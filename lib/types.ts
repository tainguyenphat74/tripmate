export type Member = {
  id: string;
  name: string;
};

export type SplitType = "even" | "exact";

export type Expense = {
  id: string;
  payerId: string;
  description: string;
  amount: number; // VND, integer
  splitType: SplitType;
  shares: { memberId: string; amount: number }[];
};

export type Place = {
  id: string;
  name: string;
  note?: string;
  url?: string;
  visited: boolean;
};

export type Trip = {
  code: string;
  name: string;
  currency: string; // "VND"
  members: Member[];
  expenses: Expense[];
  places: Place[];
};
