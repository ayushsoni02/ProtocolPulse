import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ProtocolPulse - Real-Time DeFi Protocol Health Analysis",
  description: "Analyze user behavior patterns to predict DeFi protocol health before problems become obvious. Compare Uniswap vs SushiSwap with real-time data from The Graph Protocol.",
  keywords: "DeFi, protocol health, Uniswap, SushiSwap, blockchain analytics, user behavior, protocol comparison",
  authors: [{ name: "ProtocolPulse Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "ProtocolPulse - Real-Time DeFi Protocol Health Analysis",
    description: "Analyze user behavior patterns to predict DeFi protocol health before problems become obvious.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProtocolPulse - Real-Time DeFi Protocol Health Analysis",
    description: "Analyze user behavior patterns to predict DeFi protocol health before problems become obvious.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
