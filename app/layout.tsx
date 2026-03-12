import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Modern Day Circus AI Content Extractor",
  description: "Transform Instagram archives into Shopify-ready content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // apply CSS variable colors globally using Tailwind arbitrary values
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg)] text-[var(--text)]`}
      >
        <nav className="border-b border-gray-200 bg-white px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-purple-600">
                🎪 Modern Day Circus Extractor
              </Link>
              <div className="flex space-x-4">
                <Link href="/import" className="text-gray-600 hover:text-purple-600">
                  Import
                </Link>
                <Link href="/library" className="text-gray-600 hover:text-purple-600">
                  Library
                </Link>
                <Link href="/analyze" className="text-gray-600 hover:text-purple-600">
                  Analyze
                </Link>
                <Link href="/clusters" className="text-gray-600 hover:text-purple-600">
                  Clusters
                </Link>
                <Link href="/shopify" className="text-gray-600 hover:text-purple-600">
                  Shopify
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
