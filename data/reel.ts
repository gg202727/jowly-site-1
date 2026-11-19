// Le montage du hero : le logo joue d'abord, puis ces extraits s'enchaînent dans l'ordre.
export type ReelItem = {
  id: string;        // ID YouTube d'un projet de data/projects.ts
  clip?: string;     // OPTION A (la meilleure) : mp4 muet dans public/reel/ ("/reel/01.mp4")
  start?: number;    // OPTION B : seconde de départ de l'extrait, joué via YouTube en muet
  duration?: number; // durée de la slide en secondes (3,5 par défaut)
  fit?: "cover" | "contain"; // "cover" (défaut) : plein écran. "contain" : image entière avec bandes (cinémascope)
};

// Sans clip ni start, la slide affiche la miniature YouTube avec un léger zoom.
export const REEL: ReelItem[] = [
  { id: "B2DkDLgVAZo", clip: "/reel/bane.mp4", duration: 9.9 }, // Bane : montage de 10 s, recadré plein écran comme les autres slides
  { id: "Q_R6ys2csMs", clip: "/reel/ohmama.mp4", duration: 10 },                           // Ohmama (Vilhelm), slide 2
  { id: "ngNEgSNmy5Y", clip: "/reel/erex.mp4", duration: 10 },   // Erex, Bloody Clubby
  { id: "9erw31AUanE", clip: "/reel/lili.mp4", duration: 7.2 },  // Lili Castiglioni, Only One
  { id: "pnmmNCYeSf0", clip: "/reel/nava.mp4", duration: 7.2 },   // Nava, Nava Wip
  { id: "DCfBO0k98y8", clip: "/reel/xxspades.mp4", duration: 10 }, // XxSpades, Metal Taste (teaser de 10 s)
  { id: "7lgTKuEZLkc", clip: "/reel/honda-civic.mp4", duration: 10 },             // Honda Civic (montage de 10 s)
  { id: "Ohg_JFt8vz4", clip: "/reel/jles-m-pas-nn-plus.mp4", duration: 10 },  // Jles m pas nn plus
  { id: "TrfTsMGwvXk", clip: "/reel/vivre-cest-mourir.mp4", duration: 10 }, // Vivre c'est mourir (Sodade)
  { id: "ztm0FiQAmZg", clip: "/reel/bitter-sweet.mp4", duration: 10 },             // Bitter & Sweet (montage de 10 s)
  { id: "wRJd3O9NkfM", clip: "/reel/gilera.mp4", duration: 10 },                          // Gilera
  { id: "FzZWwQVD69Q", clip: "/reel/zaza.mp4", duration: 10 },                              // Zaza Hook
];
