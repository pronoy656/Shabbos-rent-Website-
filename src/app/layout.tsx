import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shabosrent.com"),
  title: "Shabos Rent | Find, Stay & Swap Apartments",
  description: "The premier platform for discovering and managing short-term rentals and apartment swaps for Shabbos and Yom Tov.",
  icons: {
    icon: "/launchericon-192x192.png",
    shortcut: "/launchericon-192x192.png",
    apple: "/launchericon-192x192.png",
  },
  openGraph: {
    title: "Shabos Rent | Find, Stay & Swap Apartments",
    description: "The premier platform for discovering and managing short-term rentals and apartment swaps for Shabbos and Yom Tov.",
    images: [
      {
        url: "/launchericon-192x192.png",
        width: 192,
        height: 192,
        alt: "Shabos Rent Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
