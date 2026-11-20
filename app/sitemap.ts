import { MetadataRoute } from "next";

const BASE = "https://jowly.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Si tu as d'autres pages, décommente et adapte :
    // { url: `${BASE}/projets`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // { url: `${BASE}/a-propos`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    // { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}
