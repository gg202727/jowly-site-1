import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const syne = Inter_Tight({ subsets: ["latin"], variable: "--font-syne" }); // titres
const grotesk = Inter({ subsets: ["latin"], variable: "--font-grotesk" }); // textes

export const metadata: Metadata = {
  title: "Jowly",
  description: "Jowly. Réalisateur. Vidéos, clips & short films",
  openGraph: {
    title: "Jowly",
    description: "Jowly. Réalisateur. Vidéos, clips & short films",
    siteName: "Jowly",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${grotesk.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
