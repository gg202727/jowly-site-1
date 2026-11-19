export type Category = "Clip" | "Publicité" | "Brand content";

export type Project = {
  id: string;        // ID YouTube : youtube.com/watch?v=XXXXXXXXXXX -> "XXXXXXXXXXX"
  title: string;
  who: string;       // artiste ou marque
  category: Category;
  year: number;
  preview?: string;  // extrait vidéo muet joué au survol de la tuile (ici : le même extrait de 10 s que la slide)
  thumb?: string;    // optionnel : vignette locale (public/thumbs/xxx.jpg). Sans elle, miniature YouTube de `id`
  drive?: string;    // optionnel : lien de partage Google Drive du film (ou son ID). Prioritaire sur YouTube
  file4k?: string;   // optionnel : version 4K du film (bouton HD / 4K dans le lecteur)
  file4kType?: string; // type MIME + codecs de file4k, pour savoir si le navigateur sait la lire (défaut : AV1)
  file?: string;     // optionnel : film hébergé avec le site (ex. "/films/bane.mp4"). Prioritaire sur Drive et YouTube
};

export const CATEGORIES: ("Tous" | Category)[] = ["Tous", "Clip", "Publicité", "Brand content"];

// `id` : ID YouTube de la vidéo (lecteur YouTube intégré dans la lightbox). `thumb` : vignette locale optionnelle.
export const PROJECTS: Project[] = [
  { id: "B2DkDLgVAZo", preview: "/reel/bane.mp4", title: "Bane", who: "Tony Seng", category: "Clip", year: 2025 },
  { id: "Q_R6ys2csMs", preview: "/reel/ohmama.mp4", title: "Ohmama", who: "Vilhelm", category: "Clip", year: 2026,
    thumb: "/thumbs/ohmama.jpg" },
  { id: "ngNEgSNmy5Y", preview: "/reel/erex.mp4", thumb: "/thumbs/bloody-clubby.jpg", title: "Bloody Clubby", who: "Erex", category: "Clip", year: 2026 },
  { id: "9erw31AUanE", preview: "/reel/lili.mp4", title: "Only One", who: "Lili Castiglioni", category: "Clip", year: 2024 },
  { id: "pnmmNCYeSf0", preview: "/reel/nava.mp4", title: "Nava Wip", who: "Nava", category: "Brand content", year: 2024 },
  { id: "DCfBO0k98y8", preview: "/reel/xxspades.mp4", title: "Metal Taste", who: "XxSpades", category: "Clip", year: 2025,
    thumb: "/thumbs/metal-taste.jpg" },
  { id: "7lgTKuEZLkc", preview: "/reel/honda-civic.mp4", title: "Honda Civic", who: "Err Walou & Tommy Moisi", category: "Clip", year: 2025,
    thumb: "/thumbs/honda-civic.jpg" },
  { id: "Ohg_JFt8vz4", preview: "/reel/jles-m-pas-nn-plus.mp4", title: "Jles m pas nn plus", who: "Wasting Shit", category: "Clip", year: 2024,
    thumb: "/thumbs/jles-m-pas-nn-plus.jpg" },
  { id: "TrfTsMGwvXk", preview: "/reel/vivre-cest-mourir.mp4", title: "Vivre c'est mourir", who: "Sodade", category: "Clip", year: 2026,
    thumb: "/thumbs/vivre-cest-mourir.jpg" },
  { id: "ztm0FiQAmZg", preview: "/reel/bitter-sweet.mp4", title: "Bitter & Sweet", who: "Lili Castiglioni", category: "Clip", year: 2025,
    thumb: "/thumbs/bitter-sweet.jpg" },
  { id: "wRJd3O9NkfM", preview: "/reel/gilera.mp4", title: "Gilera", who: "Yarok", category: "Clip", year: 2025,
    thumb: "/thumbs/gilera.jpg" },
  { id: "FzZWwQVD69Q", preview: "/reel/zaza.mp4", title: "Zaza Hook", who: "", category: "Clip", year: 2024,
    thumb: "/thumbs/zaza.jpg" },
];
