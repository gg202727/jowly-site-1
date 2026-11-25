import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const syne = Inter_Tight({ subsets: ["latin"], variable: "--font-syne" }); // titres
const grotesk = Inter({ subsets: ["latin"], variable: "--font-grotesk" }); // textes

const URL_SITE = "https://jowly.fr";
const DESC = "Jowly. Réalisateur. Vidéos, clips & short films";
const TITLE = "Jowly | Réalisateur";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/",
    siteName: "Jowly",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Jowly, réalisateur" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og.jpg"] },
};

// Données structurées : disent à Google que « Jowly » est un réalisateur, avec ses pages officielles
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${URL_SITE}/#website`, url: `${URL_SITE}/`, name: "Jowly", alternateName: ["JOWLY", "jowly.fr"], inLanguage: "fr-FR" },
    {
      "@type": "Person", "@id": `${URL_SITE}/#jowly`, name: "Jowly", alternateName: "JOWLY",
      jobTitle: "Réalisateur", url: `${URL_SITE}/`,
      description: DESC,
      sameAs: SITE.socials.map((s) => s.href),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${grotesk.variable}`}>
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
