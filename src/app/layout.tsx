import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Jost, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const bebasNeue = localFont({
  src: "../../public/fonts/Bebas_Neue/BebasNeue-Regular.ttf",
  variable: "--font-bebas-neue",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "THINK.BEFORE.YOU.INK",
    template: "%s | THINK.BEFORE.YOU.INK",
  },
  description:
    "Custom tattoos connecting history and modern art, specializing in Arabic calligraphy, Mesopotamian symbols, and elegant fine line tattooing.",
};

const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
  : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0d0d0d] text-white">
      <head>
        <meta
          name="description"
          content="Custom tattoos connecting history and modern art, specializing in Arabic calligraphy, Mesopotamian symbols, and elegant fine line tattooing."
        />
        <meta name="theme-color" content="#0d0d0d" />
        {supabaseOrigin ? (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        ) : null}
      </head>
      <body
        className={`${bebasNeue.variable} ${cormorantGaramond.variable} ${jost.variable} ${geistMono.variable} bg-[#0d0d0d] text-white antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
