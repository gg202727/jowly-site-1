import { ArrowUpRight, Instagram, Youtube } from "lucide-react";
import { SITE } from "@/lib/site";

const ICONS: Record<string, typeof Instagram> = { Instagram, YouTube: Youtube };

export default function Contact() {
  return (
    <footer id="contact" className="px-5 pb-10 pt-32 md:px-8">
      <div className="grid gap-x-6 gap-y-10 border-t border-white/10 pt-10 md:grid-cols-[1fr_3fr]">
        <p className="text-[13px] text-muted">Contact</p>

        <div className="flex flex-col gap-8">
          {/* Un clic sur le mail ouvre la messagerie de la personne */}
          <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Projet vidéo")}`}
             className="group inline-flex w-fit max-w-full items-center gap-3 break-all font-display text-[clamp(1.4rem,3vw,2.5rem)] font-medium tracking-tight transition-colors hover:text-neon">
            {SITE.email}
            <ArrowUpRight size={22} strokeWidth={1.5} className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <ul className="flex gap-8 text-base text-white/70">
            {SITE.socials.map((s) => {
              const Icon = ICONS[s.label];
              return (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                     className="inline-flex items-center gap-2.5 transition-colors hover:text-white">
                    {Icon && <Icon size={20} strokeWidth={1.5} />}
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="mt-16 text-xs text-muted">© {new Date().getFullYear()}</p>
    </footer>
  );
}
