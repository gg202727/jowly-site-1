"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";
import { REEL } from "@/data/reel";
import VideoModal from "./VideoModal";

type Clip = { project: Project; clip?: string; start?: number; duration: number; fit?: "cover" | "contain" };

// Le logo (2 s) est une intro : il n'est pas une slide (pas de segment, pas de flèche, il ne revient pas).
const INTRO_MS = 2700; // logo 2,06 s + délai de lecture : onEnded passe à la suite avant
const TAGLINE = "Jowly. Réalisateur. Vidéos, clips & short films.";

const CLIPS: Clip[] = REEL.flatMap((r): Clip[] => {
  const project = PROJECTS.find((p) => p.id === r.id);
  return project ? [{ project, clip: r.clip, start: r.start, duration: r.duration ?? 3.5, fit: r.fit }] : [];
});

function Media({ s }: { s: Clip }) {
  if (s.clip) return <video src={s.clip} autoPlay muted loop playsInline preload="auto" className={`h-full w-full ${s.fit === "contain" ? "object-contain" : "object-cover"}`} />;
  if (s.start !== undefined) {
    const src = `https://www.youtube-nocookie.com/embed/${s.project.id}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1&start=${s.start}&end=${s.start + Math.ceil(s.duration) + 1}`;
    return (
      <iframe src={src} title={s.project.title} tabIndex={-1} allow="autoplay; encrypted-media"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[max(100vh,56.25vw)] w-[max(100vw,177.78vh)] -translate-x-1/2 -translate-y-1/2" />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <motion.img src={s.project.thumb ?? `https://i.ytimg.com/vi/${s.project.id}/maxresdefault.jpg`} alt=""
      initial={{ scale: 1 }} animate={{ scale: 1.12 }} transition={{ duration: s.duration + 1, ease: "linear" }}
      className="h-full w-full object-cover" />
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [intro, setIntro] = useState(true);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  const touchX = useRef(0);

  const n = CLIPS.length;
  const clip = CLIPS[i];
  const showIntro = intro || !clip;
  const ms = showIntro ? INTRO_MS : clip.duration * 1000;
  const playing = inView && !reduce && !open;
  const next = () => setI((v) => (v + 1) % n);
  const prev = () => setI((v) => (v - 1 + n) % n);

  // Avec « réduire les animations », on saute l'intro et le montage reste fixe
  useEffect(() => { if (reduce) setIntro(false); }, [reduce]);

  // Après l'intro, les slides s'enchaînent et reviennent à la première, jamais au logo
  useEffect(() => {
    if (!playing || !n) return;
    const t = setTimeout(() => (showIntro ? setIntro(false) : next()), ms);
    return () => clearTimeout(t);
  }, [i, showIntro, playing, ms, n]);

  useEffect(() => {
    if (!inView || open || showIntro) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [inView, open, showIntro]);

  // Le logo démarre juste après le début de l'apparition
  const logoRef = useCallback((v: HTMLVideoElement | null) => {
    if (!v || reduce) return;
    v.currentTime = 0;
    const t = setTimeout(() => v.play().catch(() => {}), 300);
    v.addEventListener("emptied", () => clearTimeout(t), { once: true });
  }, [reduce]);

  const arrow =
    "absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white/70 transition-colors [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.6))] hover:text-white focus-visible:text-white";

  return (
    <section
      ref={ref} id="top" aria-label="Showreel JOWLY"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (showIntro) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
      }}
      className="group relative h-screen min-h-[560px] overflow-hidden bg-bg"
    >
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            key="intro"
            className="absolute inset-0 flex items-center justify-center bg-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 1, transition: { duration: 0.7 } }}
            transition={{ duration: 0.9 }}
          >
            <video ref={logoRef} muted playsInline preload="auto" poster="/logo-poster.jpg"
              onEnded={() => playing && setIntro(false)} aria-label="Logo JOWLY animé"
              className="block h-[min(78vh,820px)] w-auto max-w-[92vw] mix-blend-lighten">
              <source src="/logo-loop.webm" type="video/webm" />
              <source src="/logo-loop.mp4" type="video/mp4" />
            </video>
          </motion.div>
        ) : (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center overflow-hidden bg-bg"
            initial={{ clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0%)" }}
            exit={{ opacity: 1, transition: { duration: 0.7 } }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
          >
            <Media s={clip} />
            {clip.fit !== "contain" && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <button type="button" data-cursor="play" aria-label={`Lire ${clip.project.title}`}
          onClick={() => setOpen(clip.project)} className="absolute inset-0 z-10" />
      )}

      <div className="pointer-events-none absolute bottom-14 left-5 z-20 max-w-[calc(100%-7rem)] text-xs text-white/70 md:left-8">
        {showIntro ? (
          TAGLINE
        ) : (
          <div className="flex items-baseline gap-5 whitespace-nowrap">
            <h3 className="font-display text-[clamp(1.05rem,1.5vw,1.35rem)] font-medium leading-none tracking-tight text-white">{clip.project.title}</h3>
            <span className="truncate text-[13px] text-white/55">{[clip.project.who, clip.project.category, String(clip.project.year)].filter(Boolean).join(" / ")}</span>
          </div>
        )}
      </div>

      <div data-nosnippet className="absolute bottom-14 right-5 z-20 text-xs text-white/70 md:right-8">
        <a href="#work" data-cursor="link">Scroll</a>
      </div>

      {!showIntro && (
        <>
          <div className="absolute inset-x-5 bottom-5 z-20 flex gap-1.5 md:inset-x-8">
            {CLIPS.map((_, k) => (
              <button key={k} type="button" data-cursor="link" aria-label={`Slide ${k + 1}`} onClick={() => setI(k)}
                className="flex h-3.5 flex-1 items-center">
                <span className="relative block h-0.5 w-full overflow-hidden bg-white/20">
                  {k < i && <span className="absolute inset-0 bg-white" />}
                  {k === i && (
                    <motion.span key={`${i}-${playing}`} className="absolute inset-0 origin-left bg-white"
                      initial={{ scaleX: 0 }} animate={{ scaleX: playing ? 1 : 0 }}
                      transition={{ duration: ms / 1000, ease: "linear" }} />
                  )}
                </span>
              </button>
            ))}
          </div>

          <button type="button" data-cursor="link" aria-label="Slide précédente" onClick={prev} className={`${arrow} left-3 md:left-6`}>
            <ArrowLeft size={16} strokeWidth={1.5} />
          </button>
          <button type="button" data-cursor="link" aria-label="Slide suivante" onClick={next} className={`${arrow} right-3 md:right-6`}>
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </>
      )}

      <VideoModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
