# JOWLY

Site vitrine du studio : Next.js 14 (App Router), Tailwind CSS, Framer Motion.

## Lancer en local
```
npm install
npm run dev      # http://localhost:3000
npm run build    # vérifie que tout compile ; crée le dossier out/ (le site prêt à publier)
```
Node 18.18 ou plus récent. Au premier `npm install`, un fichier `package-lock.json` est créé : garde-le dans Git.

## Où modifier quoi
| Quoi | Fichier |
|---|---|
| Mail, Instagram, YouTube, ville, bio | `lib/site.ts` |
| Les projets (titre, artiste, année, ID YouTube) | `data/projects.ts` |
| Le montage du hero (ordre, extraits, durées) | `data/reel.ts` |
| Vignettes de la grille | `public/thumbs/` |
| Extraits muets du hero (mp4) | `public/reel/` |
| Logo animé d'intro | `public/logo-loop.webm`, `logo-loop.mp4`, `logo-poster.jpg` |
| Logo du header | `public/jowly-wordmark-header.png` |

## Ajouter ou changer un projet
Dans `data/projects.ts`, un projet = un objet avec `id` (l'ID de la vidéo YouTube), `title`, `who`, `category`, `year`, `thumb`, `preview`.
- Le film s'ouvre dans la lightbox avec le lecteur YouTube intégré. La vidéo doit être « Publique » ou « Non répertoriée », avec l'intégration autorisée (YouTube Studio > la vidéo > Afficher plus > Autoriser l'intégration).
- `thumb` : vignette 16:9 dans `public/thumbs/`. Sans `thumb`, la miniature YouTube est utilisée.
- `preview` : l'extrait muet de `public/reel/` qui se lance au survol de la tuile.
- Si tu changes l'`id` d'un projet, change aussi celui de la slide dans `data/reel.ts`.

## Le hero
Le logo joue une fois à l'ouverture, puis les extraits de `data/reel.ts` s'enchaînent en boucle. Flèches gauche et droite (ou touches du clavier) pour changer de slide, un clic ouvre le projet.

## Publier le site
Le site est un export statique : `npm run build` crée un dossier `out/` qui peut être hébergé n'importe où.

**GitHub Pages (gratuit, directement depuis ce dépôt)**
1. Envoie le **contenu** du dossier à la racine du dépôt (`.github/`, `app/`, `package.json`... doivent être à la racine, pas dans un sous-dossier `jowly-site/`), sur la branche `main` ou `master`.
2. Le dépôt doit être public (compte gratuit). Son nom est libre : `compte.github.io` donne `https://compte.github.io/`, tout autre nom donne `https://compte.github.io/nom-du-depot/` (le workflow règle le chemin tout seul).
3. GitHub > *Settings* > *Pages* > *Build and deployment* > *Source* : **GitHub Actions** (à faire AVANT le premier envoi, sinon le déploiement échoue).
4. Chaque push relance `.github/workflows/deploy.yml` (onglet *Actions* pour suivre).

**Cloudflare Pages (trafic illimité, en-têtes de sécurité appliqués)**
*Workers & Pages* > *Create* > *Pages* > *Import an existing Git repository*, preset **Next.js (Static HTML Export)**, commande `npx next build`, dossier `out`.

Ensuite, ouvrir chaque projet une fois en ligne pour vérifier que YouTube autorise l'intégration (musique revendiquée, restriction d'âge, etc.).

## Sécurité
- `public/_headers` : en-têtes (CSP, HSTS, anti-iframe, nosniff, Permissions-Policy). Ils sont appliqués par Cloudflare Pages et Netlify ; GitHub Pages ne sait pas les appliquer. Seuls YouTube (lecteur) et i.ytimg.com (vignettes) sont autorisés en externe. Si tu ajoutes un service (statistiques, police, Vimeo...), il faut l'ajouter à la CSP de `public/_headers`, sinon le navigateur le bloque.
- Garder les dépendances à jour : `npm audit` de temps en temps.
- Ne jamais mettre de clé ou de mot de passe dans le code. `.gitignore` exclut `.env*`.
