import Reveal from "./Reveal";
import { SITE } from "@/lib/site";

export default function About() {
  return (
    <section id="about" className="px-5 py-32 md:px-8">
      <Reveal className="grid gap-6 border-t border-white/10 pt-6 md:grid-cols-12">
        <h2 className="text-[13px] font-normal text-muted md:col-span-3">À propos</h2>
        <p className="md:col-span-9 max-w-3xl text-[clamp(1.2rem,2.2vw,2rem)] leading-normal">
          JOWLY, de son vrai nom Jérôme Gobin, est réalisateur de clips, monteur,
          artiste VFX et pilote de drone. Studio de création vidéo indépendant,
          JOWLY réalise des clips musicaux, des publicités et du contenu de
          marque.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-16 grid gap-6 border-t border-white/10 pt-6 md:grid-cols-12">
        <h4 className="text-[13px] text-muted md:col-span-3">Ce que nous faisons</h4>
        <ul className="md:col-span-9 md:columns-2 text-[clamp(1.2rem,2.2vw,2rem)] leading-normal">
          {SITE.skills.map((s) => <li key={s} className="transition-colors hover:text-neon">{s}</li>)}
        </ul>
      </Reveal>
    </section>
  );
}
