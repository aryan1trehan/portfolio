import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono, Anton, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./seo-dossier.css";
import Cursor from "@/components/Cursor";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aryan — Portfolio",
  description: "Cinematic portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${dmMono.variable}`}>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
