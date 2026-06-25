import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TripMate — Chia tiền chuyến đi",
  description:
    "Chia tiền và lên danh sách địa điểm cho nhóm bạn đi du lịch. Không cần đăng nhập.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffbeb",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {/* Phone-like column, centered on larger screens */}
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-bg shadow-[0_0_60px_rgba(28,25,23,0.06)]">
          {children}
        </div>
      </body>
    </html>
  );
}
