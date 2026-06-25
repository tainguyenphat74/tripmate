import type { Member, Trip } from "./types";

/**
 * Mock data used for the UI-first build and demo mode (no Supabase env).
 * "Me" is Phát (m1) for the "you owe / you're owed" labels.
 */
export const CURRENT_MEMBER_ID = "m1";

// Same group of friends across trips.
const members: Member[] = [
  { id: "m1", name: "Phát" },
  { id: "m2", name: "An" },
  { id: "m3", name: "Bình" },
  { id: "m4", name: "Minh" },
  { id: "m5", name: "Hà" },
];

const dalat: Trip = {
  id: "11111111-1111-1111-1111-111111111111",
  code: "dalat-0626",
  name: "Đà Lạt 06/2026",
  currency: "VND",
  settlements: [],
  members,
  expenses: [
    {
      id: "e1",
      payerId: "m1",
      description: "Khách sạn 2 đêm",
      amount: 2_400_000,
      splitType: "even",
      shares: members.map((m) => ({ memberId: m.id, amount: 480_000 })),
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
      shares: members.map((m) => ({ memberId: m.id, amount: 80_000 })),
    },
    {
      id: "e4",
      payerId: "m4",
      description: "Xăng xe",
      amount: 600_000,
      splitType: "even",
      shares: members.map((m) => ({ memberId: m.id, amount: 120_000 })),
    },
  ],
  places: [
    { id: "p1", name: "Hồ Tuyền Lâm", note: "Chèo SUP buổi sáng sớm", visited: true },
    { id: "p2", name: "Quảng trường Lâm Viên", note: "Chụp ảnh buổi tối", visited: true },
    { id: "p3", name: "Vườn hoa thành phố", visited: false },
    { id: "p4", name: "Đồi chè Cầu Đất", note: "Săn mây bình minh", visited: false },
    { id: "p5", name: "Chợ đêm Đà Lạt", note: "Ăn bánh tráng nướng", visited: false },
  ],
};

const vungtau: Trip = {
  id: "22222222-2222-2222-2222-222222222222",
  code: "vungtau-0726",
  name: "Vũng Tàu 07/2026",
  currency: "VND",
  settlements: [],
  members,
  expenses: [
    {
      id: "ve1",
      payerId: "m1",
      description: "Resort 1 đêm",
      amount: 3_000_000,
      splitType: "even",
      shares: members.map((m) => ({ memberId: m.id, amount: 600_000 })),
    },
    {
      id: "ve2",
      payerId: "m3",
      description: "Hải sản chợ Xóm Lưới",
      amount: 1_250_000,
      splitType: "even",
      shares: members.map((m) => ({ memberId: m.id, amount: 250_000 })),
    },
  ],
  places: [
    { id: "vp1", name: "Tượng Chúa Kitô Vua", note: "Leo 800 bậc, ngắm toàn cảnh biển", visited: true },
    { id: "vp2", name: "Ngọn Hải Đăng Vũng Tàu", note: "Săn bình minh sớm", visited: false },
    { id: "vp3", name: "Mũi Nghinh Phong", note: 'Chụp ảnh "cổng trời"', visited: false },
    { id: "vp4", name: "Bãi Sau (Thùy Vân)", note: "Tắm biển buổi chiều", visited: true },
    { id: "vp5", name: "Bạch Dinh", note: "Di tích kiến trúc Pháp", visited: false },
    { id: "vp6", name: "Hồ Mây Park", note: "Đi cáp treo lên Núi Lớn", visited: false },
    { id: "vp7", name: "Chợ Xóm Lưới", note: "Ăn hải sản tươi sống", visited: true },
  ],
};

/** All demo trips, keyed by join code. */
export const mockTrips: Record<string, Trip> = {
  [dalat.code]: dalat,
  [vungtau.code]: vungtau,
};

/** Default demo trip (used as fallback for unknown codes in demo mode). */
export const mockTrip = dalat;
