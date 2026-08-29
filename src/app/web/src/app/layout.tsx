import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PortfolioDataProvider } from "@/contexts/PortfolioDataContext";

export const metadata: Metadata = {
  title: "Portfolio | Mohamed IBEN EL ABED",
  description: "Senior Backend Developer & Technical Lead - Experienced in Java, Spring Boot, BPMN, and cloud infrastructure",
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

/**
 * Root Layout with multi-language support
 *
 * Provider hierarchy:
 * 1. LanguageProvider - Manages language state (outermost)
 * 2. PortfolioDataProvider - Fetches data based on language
 * 3. ThemeProvider - Manages theme state
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // globals.css sets `scroll-behavior: smooth` on <html> for the anchor-based
  // section navigation. As of Next.js 16 the router no longer suppresses that
  // during route transitions unless `data-scroll-behavior` opts back in, which
  // would otherwise make navigations animate instead of jumping.
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <LanguageProvider defaultLanguage="en" enableLanguageDetection={true}>
          <PortfolioDataProvider>
            <ThemeProvider defaultTheme="light">
              {children}
            </ThemeProvider>
          </PortfolioDataProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}