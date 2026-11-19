// Préfixe les chemins locaux (/reel/..., /thumbs/...) avec le basePath du site.
// Sur GitHub Pages, un dépôt qui n'est pas « compte.github.io » est servi dans un sous-dossier (/nom-du-depot/).
// Le basePath est injecté au build par le workflow (NEXT_PUBLIC_BASE_PATH). Vide en local et sur un domaine à la racine.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string;
export function asset(path?: string): string | undefined;
export function asset(path?: string) {
  if (!path) return path;
  return path.startsWith("/") && !path.startsWith("//") ? BASE + path : path;
}
