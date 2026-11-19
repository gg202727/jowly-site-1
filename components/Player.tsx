"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

const glass =
  "bg-[rgba(28,28,30,0.55)] backdrop-blur-[24px] backdrop-saturate-[1.8] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_0_0_0.5px_rgba(255,255,255,0.12)]";

/** Curseur horizontal sur mesure (un seul trait). Sert à la position et au volume. */
function Slider({ value, buffer, onChange, label, className = "" }: {
  value: number; buffer?: number; onChange: (v: number) => void; label: string; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const at = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    return Math.max(0, Math.min(1, (x - r.left) / r.width));
  };
  return (
    <div
      ref={ref} role="slider" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}
      className={`group/s relative flex h-5 touch-none items-center ${className}`}
      onPointerDown={(e) => { setDrag(true); e.currentTarget.setPointerCapture(e.pointerId); onChange(at(e.clientX)); }}
      onPointerMove={(e) => drag && onChange(at(e.clientX))}
      onPointerUp={() => setDrag(false)}
    >
      <div className={`relative w-full overflow-hidden rounded-full bg-white/20 transition-[height] duration-200 ${drag ? "h-1.5" : "h-1 group-hover/s:h-1.5"}`}>
        {buffer !== undefined && <div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: `${buffer * 100}%` }} />}
        <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${value * 100}%` }} />
      </div>
      <div
        className={`pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.4)] transition duration-200 ${drag ? "scale-100 opacity-100" : "scale-50 opacity-0 group-hover/s:scale-100 group-hover/s:opacity-100"}`}
        style={{ left: `${value * 100}%` }}
      />
    </div>
  );
}

/**
 * Lecteur des films hébergés (champ `file`). Un seul trait de progression, contrôles flottants en verre dépoli.
 * Clic sur l'image : lecture / pause. Clavier : espace ou K, flèches ±5 s, M son, F plein écran.
 * Les contrôles se cachent après 2 s de lecture sans mouvement.
 */
const AV1 = 'video/mp4; codecs="av01.0.12M.08, mp4a.40.2"';

// Dès qu'une version 4K existe et que le navigateur sait la lire, on la choisit d'office
function pick4k(src4k?: string, type?: string) {
  if (!src4k || typeof window === "undefined") return false;
  if (!document.createElement("video").canPlayType(type ?? AV1)) return false;
  return true; // la meilleure qualité disponible est toujours choisie d'office
}
function can4k(src4k?: string, type?: string) {
  return !!src4k && typeof window !== "undefined" && !!document.createElement("video").canPlayType(type ?? AV1);
}

export default function Player({ src, src4k, type4k }: { src: string; src4k?: string; type4k?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const hideT = useRef<ReturnType<typeof setTimeout>>();
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [buf, setBuf] = useState(0);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(1);
  const [ui, setUi] = useState(true);
  const [full, setFull] = useState(false);
  const [wait, setWait] = useState(true);
  const [q4k, setQ4k] = useState(() => pick4k(src4k, type4k));
  const resume = useRef<{ t: number; play: boolean } | null>(null);
  const has4k = can4k(src4k, type4k);
  const cur = q4k && src4k ? src4k : src;
  const switchQuality = () => {
    const v = vid.current;
    resume.current = { t: v?.currentTime ?? 0, play: v ? !v.paused : true };
    setQ4k((x) => !x);
  };

  const wake = useCallback(() => {
    setUi(true);
    clearTimeout(hideT.current);
    hideT.current = setTimeout(() => { if (vid.current && !vid.current.paused) setUi(false); }, 2000);
  }, []);
  const toggle = useCallback(() => {
    const v = vid.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);
  const seekBy = useCallback((d: number) => {
    const v = vid.current;
    if (v) v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + d));
  }, []);
  const toggleMute = useCallback(() => { if (vid.current) vid.current.muted = !vid.current.muted; }, []);
  const toggleFull = useCallback(() => {
    const v = vid.current as unknown as { webkitEnterFullscreen?: () => void } | null;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (box.current?.requestFullscreen) box.current.requestFullscreen();
    else v?.webkitEnterFullscreen?.(); // iPhone
  }, []);

  useEffect(() => {
    const onFs = () => setFull(!!document.fullscreenElement);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); wake(); }
      else if (e.key === "ArrowRight") { seekBy(5); wake(); }
      else if (e.key === "ArrowLeft") { seekBy(-5); wake(); }
      else if (e.key === "m") toggleMute();
      else if (e.key === "f") toggleFull();
    };
    document.addEventListener("fullscreenchange", onFs);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      window.removeEventListener("keydown", onKey);
      clearTimeout(hideT.current);
    };
  }, [toggle, seekBy, toggleMute, toggleFull, wake]);

  const sync = (v: HTMLVideoElement) => {
    setT(v.currentTime);
    if (v.buffered.length) setBuf(v.buffered.end(v.buffered.length - 1));
  };
  const btn = "flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15";
  const filled = { size: 18, fill: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round" } as const;
  const outline = { size: 18, strokeWidth: 1.75 } as const;

  return (
    <div ref={box} onMouseMove={wake} className={`relative h-full w-full select-none overflow-hidden bg-black ${full && ui ? "cursor-default [&_button]:cursor-pointer [&_[role=slider]]:cursor-pointer" : ""} ${ui ? "" : "cursor-none"}`}>
      <video
        ref={vid} src={cur} autoPlay playsInline preload="metadata" onClick={toggle}
        onPlay={() => { setPlaying(true); wake(); }}
        onPause={() => { setPlaying(false); setUi(true); }}
        onEnded={() => setUi(true)}
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          setDur(v.duration);
          if (resume.current) { // changement HD / 4K : on reprend là où on était
            v.currentTime = resume.current.t;
            if (resume.current.play) v.play().catch(() => {});
            resume.current = null;
          }
        }}
        onDurationChange={(e) => setDur(e.currentTarget.duration)}
        onTimeUpdate={(e) => sync(e.currentTarget)}
        onProgress={(e) => sync(e.currentTarget)}
        onWaiting={() => setWait(true)}
        onPlaying={() => setWait(false)}
        onCanPlay={() => setWait(false)}
        onVolumeChange={(e) => { setMuted(e.currentTarget.muted); setVol(e.currentTarget.volume); }}
        className="h-full w-full object-contain"
      />

      {/* Bouton central, uniquement quand la vidéo est à l'arrêt */}
      <button
        type="button" onClick={toggle} aria-label="Lecture"
        className={`absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white transition duration-300 ${glass} ${playing ? "pointer-events-none scale-90 opacity-0" : "opacity-100"}`}
      >
        <Play size={26} fill="currentColor" strokeWidth={1.5} strokeLinejoin="round" className="ml-[3px]" />
      </button>

      {/* Contrôles flottants */}
      <div
        className={`absolute bottom-4 left-1/2 flex w-[min(680px,calc(100%-24px))] -translate-x-1/2 items-center gap-3 rounded-2xl px-4 py-2 text-white transition duration-300 md:bottom-6 ${glass} ${ui ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
      >
        <button type="button" onClick={toggle} className={btn} aria-label={playing ? "Pause" : "Lecture"}>
          {playing ? <Pause {...filled} /> : <Play {...filled} />}
        </button>
        <span className="min-w-[3.2ch] text-xs font-medium tabular-nums text-white/85">{fmt(t)}</span>
        <Slider
          label="Position" value={dur ? t / dur : 0} buffer={dur ? buf / dur : 0}
          onChange={(p) => { const v = vid.current; if (v?.duration) v.currentTime = p * v.duration; }}
          className={`flex-1 ${wait ? "animate-pulse" : ""}`}
        />
        <span className="min-w-[3.8ch] text-right text-xs font-medium tabular-nums text-white/85">-{fmt(dur - t)}</span>
        <div className="group/vol hidden items-center gap-1.5 md:flex">
          <button type="button" onClick={toggleMute} className={btn} aria-label={muted ? "Activer le son" : "Couper le son"}>
            {muted || vol === 0 ? <VolumeX {...outline} /> : <Volume2 {...outline} />}
          </button>
          <Slider
            label="Volume" value={muted ? 0 : vol}
            onChange={(p) => { const v = vid.current; if (v) { v.muted = false; v.volume = p; } }}
            className="w-0 overflow-visible opacity-0 transition-[width,opacity] duration-200 group-hover/vol:w-16 group-hover/vol:opacity-100"
          />
        </div>
        {src4k && has4k && (
          <button type="button" onClick={switchQuality} aria-label={q4k ? "Passer en HD" : "Passer en 4K"}
            className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-white/90 transition-colors hover:bg-white/15">
            {q4k ? "4K" : "HD"}
          </button>
        )}
        <button type="button" onClick={toggleFull} className={btn} aria-label="Plein écran">
          {full ? <Minimize {...outline} /> : <Maximize {...outline} />}
        </button>
      </div>
    </div>
  );
}
