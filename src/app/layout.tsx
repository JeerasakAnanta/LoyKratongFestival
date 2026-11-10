import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FESTIVAL_DATE_DISPLAY } from "@/lib/festival-data";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "ลอยกระทง 2026 · Loy Kratong Festival",
    template: "%s · ลอยกระทง 2026",
  },
  description:
    "รวมวันและจุดลอยกระทงสำคัญทั่วไทย ประวัติประเพณี วิธีทำกระทง และคำอธิษฐาน ปีนี้ลอยกระทงวันที่ 24 พฤศจิกายน 2026",
  keywords: [
    "ลอยกระทง",
    "ประเพณีไทย",
    "Loy Kratong",
    "ลอยกระทง 2569",
    "จุดลอยกระทง",
    "ยี่เป็ง",
  ],
  openGraph: {
    title: "ลอยกระทง 2026 · Loy Kratong Festival",
    description:
      "รวมวันและจุดลอยกระทงสำคัญทั่วไทย ประวัติประเพณี วิธีทำกระทง และคำอธิษฐาน",
    type: "website",
    locale: "th_TH",
    siteName: "Loy Kratong Festival 2026",
  },
  twitter: {
    card: "summary",
    title: "ลอยกระทง 2026 · Loy Kratong Festival",
    description:
      "รวมวันและจุดลอยกระทงสำคัญทั่วไทย ประวัติประเพณี วิธีทำกระทง และคำอธิษฐาน",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0f1a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "ลอยกระทง 2569 (Loy Kratong Festival 2026)",
              startDate: "2026-11-24",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              description:
                "ประเพณีลอยกระทง คืนวันเพ็ญเดือน 12 ของทุกปี " +
                FESTIVAL_DATE_DISPLAY,
              location: {
                "@type": "Country",
                name: "ประเทศไทย",
              },
            }),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-charcoal text-gray-100 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
