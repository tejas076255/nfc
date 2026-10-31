import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#030508" },
  ],
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
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-[#030508] text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans transition-colors duration-150`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
