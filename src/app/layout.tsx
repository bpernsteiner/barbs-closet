import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f3c4d7",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://barbs-closet.vercel.app"),
  title: "Barb's Closet",
  description: "Your Personal Fashion Assistant — AI-powered wardrobe management with smart outfit recommendations, weather-aware styling, and wardrobe analytics.",
  applicationName: "Barb's Closet",
  appleWebApp: {
    capable: true,
    title: "Barb's Closet",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Barb's Closet",
    description: "Your Personal Fashion Assistant — AI-powered wardrobe management with smart outfit recommendations.",
    siteName: "Barb's Closet",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barb's Closet",
    description: "Your Personal Fashion Assistant — AI-powered wardrobe management with smart outfit recommendations.",
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
        <Navbar />
        <main className="max-w-lg mx-auto px-4 pt-4 pb-24">
          {children}
        </main>
      </body>
    </html>
  );
}
