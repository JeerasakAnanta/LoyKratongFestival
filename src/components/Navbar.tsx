"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/events", label: "จุดลอยกระทง" },
  { href: "/about", label: "ประวัติและความเชื่อ" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-night/85 text-white backdrop-blur">
      <nav
        aria-label="เมนูหลัก"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3"
      >
        <Link href="/" className="flex items-center gap-2.5 font-serif text-lg font-bold">
          <svg viewBox="0 0 32 32" className="h-7 w-7 text-gold" aria-hidden="true" fill="currentColor">
            <path d="M16 4c1.8 3 1.8 6 0 9-1.8-3-1.8-6 0-9Zm-8 6c3 .6 5 2.4 6 5-3 .2-5-1.6-6-5Zm16 0c-1 3.4-3 5.2-6 5 1-2.6 3-4.4 6-5ZM5 17h22c-.8 5.2-5.6 9-11 9S5.8 22.2 5 17Z" />
          </svg>
          <span>
            ลอยกระทง <span className="font-normal text-gold">2026</span>
          </span>
        </Link>

        <ul className="flex flex-wrap items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[44px] items-center rounded-full px-4 text-sm font-medium transition hover:bg-white/10 hover:text-white ${
                    active ? "bg-white/10 text-gold" : "text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/float" className="btn-gold ml-1">
              ลอยกระทงออนไลน์
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
