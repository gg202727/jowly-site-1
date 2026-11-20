import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const syne = Inter_Tight({ subsets: ["latin"], variable: "--font-syne" }); // titres
const grotesk = Inter({ subsets: ["latin"], variable: "--font-grotesk" }); // textes

const SITE_URL = "https://jowly.fr";
const SITE_TITLE =
  "JOWLY | Réalisateur de clips, monteur, VFX & pilote de drone";
const SITE_DESCRIPTION =
  "JOWLY (Jérôme Gobin) est réalisateur de clips, monteur vidéo, artiste VFX et pilote de drone. Studio de création vidéo indépendant : clip musical, publicité et contenu de marque alternatif.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | JOWLY",
  },
  description: SITE_DESCRIPTION,
  applicationName: "JOWLY",
  authors: [{ name: "Jérôme Gobin", url: SITE_URL }],
  creator: "Jérôme Gobin",
  keywords: [
    "JOWLY",
    "jowly.fr",
    "jowly.mov",
    "jowly mov",
    "Jérôme Gobin",
    "Jerome Gobin",
    "jerome gobin réalisateur",
    "Jérôme Gobin JOWLY",
    "réalisateur clip",
    "monteur vidéo",
    "VFX",
    "pilote de drone",
    "réalisation de clips",
    "prises de vues drone",
    "studio de création vidéo",
    "clip musical",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "JOWLY",
    locale: "fr_FR",
    title: SITE_TITLE,
    description:
      "Portfolio de JOWLY : réalisation de clips, montage, VFX et drone.",
    images: [
      {
        url: "/og.jpg", // image 1200x630 à placer dans /public/og.jpg
        width: 1200,
        height: 630,
        alt: "JOWLY - Réalisateur de clips, monteur, VFX et pilote de drone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "Portfolio de JOWLY : réalisation de clips, montage, VFX et drone.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  // Inutile si tu vérifies Search Console par DNS TXT.
  // Si tu choisis la balise HTML, décommente et colle la valeur :
  // verification: { google: "TA-VALEUR" },
};

// Données structurées : aident Google à relier "JOWLY", "Jérôme Gobin" et jowly.fr
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JOWLY",
    alternateName: [
      "Jowly",
      "jowly.fr",
      "jowly.mov",
      "JOWLY portfolio",
      "Jérôme Gobin",
      "Jerome Gobin",
    ],
    url: SITE_URL,
    inLanguage: "fr-FR",
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jérôme Gobin",
    alternateName: ["JOWLY", "Jowly", "jowly.mov", "Jerome Gobin"],
    url: SITE_URL,
    jobTitle: [
      "Réalisateur de clips",
      "Monteur vidéo",
      "Artiste VFX",
      "Pilote de drone",
    ],
    knowsAbout: [
      "Réalisation de clips",
      "Montage vidéo",
      "VFX",
      "Prises de vues par drone",
    ],
    sameAs: [
      "https://www.instagram.com/jowly.mov/",
      "https://www.youtube.com/@jowly",
      "https://www.tiktok.com/@jowly.mov",
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${grotesk.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
