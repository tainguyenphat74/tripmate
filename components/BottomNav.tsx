"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReceiptIcon, WalletIcon, MapPinIcon } from "./icons";

export function BottomNav({ code }: { code: string }) {
  const pathname = usePathname();
  const base = `/t/${code}`;

  const tabs = [
    { href: base, label: "Chi tiêu", Icon: ReceiptIcon, exact: true },
    { href: `${base}/balances`, label: "Số dư", Icon: WalletIcon },
    { href: `${base}/places`, label: "Địa điểm", Icon: MapPinIcon },
  ];

  return (
    <nav className="sticky bottom-0 z-20 flex border-t border-line bg-bg px-2 pt-3 pb-6">
      {tabs.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1.5 text-[11px] font-semibold ${
              active ? "text-terra" : "text-muted"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
