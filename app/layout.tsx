import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
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
    <html lang="en" className="light scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TapSync" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Standalone app launcher redirect: Always open the user profile instead of marketing website
              (function() {
                try {
                  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                                     window.navigator.standalone === true ||
                                     window.location.search.indexOf('mode=app') !== -1;
                  if (isStandalone && (window.location.pathname === '/' || window.location.pathname === '')) {
                    var slug = localStorage.getItem('last_profile_slug') || 
                               localStorage.getItem('installed_profile_slug') || 
                               (document.cookie.match(/(?:^|;\s*)last_profile_slug=([^;]+)/) || [])[1] ||
                               'htt-5311';
                    if (slug) {
                      window.location.replace('/p/' + slug);
                    }
                  }
                } catch(e) {}
              })();

              // Early capture of PWA beforeinstallprompt
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.__pwaInstallPrompt = e;
                try {
                  window.dispatchEvent(new CustomEvent('pwa-prompt-ready'));
                } catch(err) {}
              });
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased bg-slate-50 dark:bg-[#030508] text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans transition-colors duration-150`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
