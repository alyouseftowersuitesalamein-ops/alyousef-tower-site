import type { Metadata } from "next";
import "./globals.css";
import { Cairo, Cinzel } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AlYousef Tower Suites Alamein",
  description: "احجز معاينة واطلب التفاصيل",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${cinzel.variable}`}>
      <body className="font-[var(--font-cairo)]">{children}</body>
    </html>
  );
}
