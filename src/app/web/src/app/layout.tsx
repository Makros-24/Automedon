import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio application",
};

import { PortfolioDataProvider } from "@/contexts/PortfolioDataContext";

// ... (existing code)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PortfolioDataProvider>
          <ThemeProvider defaultTheme="light">
            {children}
          </ThemeProvider>
        </PortfolioDataProvider>
      </body>
    </html>
  );
}