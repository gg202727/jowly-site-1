"use client";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { asset } from "@/lib/asset";

function useParisClock() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const time = new Intl.DateTimeFormat("fr-FR", {
        timeZone: SITE.timezone, hour: "2-digit", minute: "2-digit", hour12: false,
      }).format(d);
      const gmt =
        new Intl.DateTimeFormat("en-GB", { timeZone: SITE.timezone, timeZoneName: "shortOffset" })
          .formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? "GMT";
      setLabel(`${SITE.city} — ${time} ${gmt}`);
    };
    tick();
    const id = setInterval(tick, 1000 * 15);
    return () => clearInterval(id);
  }, []);
  return label;
}

export default function Header() {
  const clock = useParisClock();
  const links = [["WORK", "#work"], ["ABOUT", "#about"], ["CONTACT", "#contact"]];

  return (
    <header className="fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto] items-center px-5 py-5 text-[13px] text-white md:grid-cols-[1fr_auto_1fr] md:px-8">
      {/* Voile dégradé : le logo, le menu et l'heure restent lisibles sur les images claires */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
      <a href="#top" data-cursor="link" aria-label="JOWLY">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/jowly-wordmark-header.png")} alt="JOWLY" className="block h-[30px] w-auto [filter:brightness(1.35)_saturate(1.15)_drop-shadow(0_1px_3px_rgba(0,0,0,0.55))]" />
      </a>
      <nav className="hidden gap-7 font-medium mix-blend-difference md:flex">
        {links.map(([l, h]) => (
          <a key={l} href={h} data-cursor="link" className="transition-opacity hover:opacity-60">[{l}]</a>
        ))}
      </nav>
      <span className="min-w-[10ch] text-right tabular-nums mix-blend-difference">{clock}</span>
    </header>
  );
}
