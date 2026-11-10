import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "หน้าแรก" },
  { href: "/events", label: "จุดลอยกระทง" },
  { href: "/float", label: "ลอยกระทงออนไลน์" },
  { href: "/about", label: "ประวัติและความเชื่อ" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal/90 text-white backdrop-blur">
      <nav
        aria-label="เมนูหลัก"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4"
      >
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden="true">🪷</span>
          <span>
            ลอยกระทง <span className="font-normal text-amber-200">2026</span>
          </span>
        </Link>

        <ul className="flex flex-wrap items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
