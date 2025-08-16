import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Automedon - AI-Powered Digital Twin Portfolio",
  description: "Interactive AI chatbot representing a professional portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
