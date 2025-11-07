import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlockLens - Solana Portfolio Tracker",
  description: "Track all your Solana wallets, tokens, and NFTs in one place. Unified analytics for Web3 portfolios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#050816] text-slate-100`}>
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
