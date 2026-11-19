import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const syne = Inter_Tight({ subsets: ["latin"], variable: "--font-syne" }); // titres
const grotesk = Inter({ subsets: ["latin"], variable: "--font-grotesk" }); // textes

export const metadata: Metadata = {
  title: "JOWLY | Studio de création vidéo",
  description:
    "Studio de création vidéo indépendant spécialisé dans le clip musical, la publicité et le contenu de marque alternatif.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${grotesk.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
