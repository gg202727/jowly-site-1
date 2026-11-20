import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://jowly.fr/sitemap.xml",
    host: "https://jowly.fr",
  };
}
