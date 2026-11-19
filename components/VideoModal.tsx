"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/data/projects";
import Player from "./Player";
import { asset } from "@/lib/asset";

// Accepte le lien de partage complet (.../file/d/ID/view) ou directement l'ID
function driveId(v: string) {
  return /\/d\/([\w-]+)/.exec(v)?.[1] ?? v;
}

export default function VideoModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog" aria-modal="true" aria-label={project.title}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-12"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            onClick={onClose} data-cursor="close" aria-label="Fermer"
            className="absolute right-5 top-5 text-white md:right-10 md:top-8"
          >
            <X size={32} />
          </button>

          <motion.div
            className="w-full max-w-[1400px]"
            initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ratio 16:9 responsive : aspect-video = aspect-ratio: 16 / 9 */}
            <div className="aspect-video w-full bg-black">
              {project.file ? (
                // Film hébergé avec le site : aucune dépendance externe
                <Player key={project.file} src={asset(project.file)} src4k={asset(project.file4k)} type4k={project.file4kType} />
              ) : project.drive ? (
                // Lecteur Google Drive : le fichier doit être partagé « Toute personne disposant du lien »
                <iframe
                  className="h-full w-full"
                  src={`https://drive.google.com/file/d/${driveId(project.drive)}/preview`}
                  title={project.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  // Sans allow-popups : le bouton « ouvrir dans une nouvelle fenêtre » de Drive ne peut pas quitter le site
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              ) : (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${project.id}?rel=0&modestbranding=1&autoplay=1&playsinline=1`}
                  title={project.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  // Sans allow-popups : un clic sur le logo ou le titre YouTube ne peut plus ouvrir YouTube dans un nouvel onglet
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              )}
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-6">
              <h3 className="font-display text-2xl font-medium leading-none tracking-tight md:text-3xl">{project.title}</h3>
              <p className="text-[13px] text-white/55">{[project.who, project.category, String(project.year)].filter(Boolean).join(" / ")}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
