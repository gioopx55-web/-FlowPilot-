import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { getLocale } from "@/lib/locale";
import { ThemeProvider, noFlashThemeScript } from "@/lib/theme/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowPilot AI",
  description: "An AI-assisted business operations cockpit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang, dir } = getLocale();

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="no-flash-theme" strategy="beforeInteractive">
          {noFlashThemeScript}
        </Script>
      </head>
      <body className="h-full">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
