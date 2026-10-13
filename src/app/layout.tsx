import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { direction, locale } from "@/lib/config/locale";
import { Providers } from "./providers";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Workflow Intelligence Platform", template: "%s · Workflow Intelligence Platform" },
  description: "Decision support and workflow optimization for senior decision-makers. Demo build with sample data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={locale} dir={direction} suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
