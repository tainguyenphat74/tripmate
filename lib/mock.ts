import type { Trip } from "./types";

/**
 * Mock trip used for the UI-first build. Replaced by Supabase data later.
 * "Me" is Phát (m1) for the purpose of the "you owe / you're owed" labels.
 */
export const CURRENT_MEMBER_ID = "m1";

export const mockTrip: Trip = {
  code: "dalat-0626",
  name: "Đà Lạt 06/2026",
  currency: "VND",
  members: [
    { id: "m1", name: "Phát" },
    { id: "m2", name: "An" },
    { id: "m3", name: "Bình" },
    { id: "m4", name: "Minh" },
    { id: "m5", name: "Hà" },
  ],
  expenses: [
    {
      id: "e1",
      payerId: "m1",
      description: "Khách sạn 2 đêm",
      amount: 2_400_000,
      splitType: "even",
      shares: [
        { memberId: "m1", amount: 480_000 },
        { memberId: "m2", amount: 480_000 },
        { memberId: "m3", amount: 480_000 },
        { memberId: "m4", amount: 480_000 },
        { memberId: "m5", amount: 480_000 },
      ],
    },
    {
      id: "e2",
      payerId: "m2",
      description: "Ăn tối lẩu",
      amount: 820_000,
      splitType: "exact",
      shares: [
        { memberId: "m1", amount: 150_000 },
        { memberId: "m2", amount: 220_000 },
        { memberId: "m3", amount: 150_000 },
        { memberId: "m4", amount: 160_000 },
        { memberId: "m5", amount: 140_000 },
      ],
    },
    {
      id: "e3",
      payerId: "m3",
      description: "Vé tham quan",
      amount: 400_000,
      splitType: "even",
      shares: [
        { memberId: "m1", amount: 80_000 },
        { memberId: "m2", amount: 80_000 },
        { memberId: "m3", amount: 80_000 },
        { memberId: "m4", amount: 80_000 },
        { memberId: "m5", amount: 80_000 },
      ],
    },
    {
      id: "e4",
      payerId: "m4",
      description: "Xăng xe",
      amount: 600_000,
      splitType: "even",
      shares: [
        { memberId: "m1", amount: 120_000 },
        { memberId: "m2", amount: 120_000 },
        { memberId: "m3", amount: 120_000 },
        { memberId: "m4", amount: 120_000 },
        { memberId: "m5", amount: 120_000 },
      ],
    },
  ],
  places: [
    {
      id: "p1",
      name: "Hồ Tuyền Lâm",
      note: "Chèo SUP buổi sáng sớm",
      visited: true,
    },
    { id: "p2", name: "Quảng trường Lâm Viên", note: "Chụp ảnh buổi tối", visited: true },
    { id: "p3", name: "Vườn hoa thành phố", visited: false },
    { id: "p4", name: "Đồi chè Cầu Đất", note: "Săn mây bình minh", visited: false },
    { id: "p5", name: "Chợ đêm Đà Lạt", note: "Ăn bánh tráng nướng", visited: false },
  ],
};
