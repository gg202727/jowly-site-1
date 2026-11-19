/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default {
  reactStrictMode: true,
  poweredByHeader: false,
  // Site 100 % statique : `npm run build` produit le dossier `out/`, hébergeable partout
  // (Cloudflare Pages, Netlify, GitHub Pages...). Les en-têtes de sécurité sont dans public/_headers.
  output: "export",
  images: { unoptimized: true },
  // Vide pour « compte.github.io » ou un domaine perso ; « /nom-du-depot » pour un site de projet GitHub Pages.
  basePath,
  trailingSlash: true,
};
