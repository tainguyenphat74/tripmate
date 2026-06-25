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

export type Settlement = {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
};

export type Trip = {
  id: string;
  code: string;
  name: string;
  currency: string; // "VND"
  members: Member[];
  expenses: Expense[];
  places: Place[];
  settlements: Settlement[];
};
