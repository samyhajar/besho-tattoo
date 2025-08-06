import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const bebasNeue = localFont({
  src: "../../public/fonts/Bebas_Neue/BebasNeue-Regular.ttf",
  variable: "--font-bebas-neue",
  display: "swap",
});

// Keep Geist Mono for code/monospace text if needed
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Besho Tattoo Studio",
  description: "Professional tattoo studio with portfolio and booking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black text-white">
      <body
        className={`${bebasNeue.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
