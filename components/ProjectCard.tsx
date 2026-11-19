"use client";
import { useState } from "react";
import type { Project } from "@/data/projects";
import { asset } from "@/lib/asset";

// Au survol, l'extrait du clip se lance en fondu par-dessus la miniature. Quand la souris sort, la miniature revient.
export default function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const [hover, setHover] = useState(false);
  const [ready, setReady] = useState(false);
  const [broken, setBroken] = useState(false);
  const [res, setRes] = useState("maxresdefault"); // repli : hqdefault si la haute définition YouTube n'existe pas

  const src = asset(project.thumb) ?? `https://i.ytimg.com/vi/${project.id}/${res}.jpg`;
  const on = () => setHover(true);
  const off = () => { setHover(false); setReady(false); };

  return (
    <button
      type="button" data-cursor="play" onClick={() => onOpen(project)}
      onMouseEnter={on} onMouseLeave={off} onFocus={on} onBlur={off}
      aria-label={`Lire ${project.title}`}
      className="group relative block aspect-video w-full overflow-hidden bg-surface text-left"
    >
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src} alt="" loading="lazy"
          onError={() => (project.thumb || res !== "maxresdefault" ? setBroken(true) : setRes("hqdefault"))}
          className="h-full w-full object-cover"
        />
      )}
      {hover && project.preview && (
        <video
          src={asset(project.preview)} autoPlay muted loop playsInline preload="auto" onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 pt-16 opacity-100 transition duration-500 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <h3 className="font-display text-2xl font-medium leading-tight tracking-tight md:text-[1.75rem]">{project.title}</h3>
        {project.who && <p className="mt-1 text-[13px] text-white/60">{project.who}</p>}
      </div>
    </button>
  );
}
