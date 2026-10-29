import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030508",
};

export const metadata: Metadata = {
  title: "TapSync | Smart Contactless NFC Business Cards & Executive Identity",
  description:
    "Universal contactless NFC business cards and digital identity platform for leaders. Instant 0.4s vCard transmission, real-time tap telemetry, dynamic multi-profile routing, and remote freeze lock.",
  openGraph: {
    title: "TapSync | Smart Contactless NFC Business Cards & Executive Identity",
    description:
      "Universal contactless NFC business cards and digital identity platform for leaders. Instant 0.4s vCard transmission, zero app needed.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TapSync | Smart Contactless NFC Business Cards & Executive Identity",
    description:
      "Universal contactless NFC business cards and digital identity platform for leaders.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030508] text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
