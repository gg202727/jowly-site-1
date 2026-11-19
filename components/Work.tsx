"use client";
import { useState } from "react";
import { CATEGORIES, PROJECTS, type Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import VideoModal from "./VideoModal";

export default function Work() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Tous");
  const [active, setActive] = useState<Project | null>(null);

  const items = PROJECTS.filter((p) => cat === "Tous" || p.category === cat);
  const count = (c: string) => (c === "Tous" ? PROJECTS.length : PROJECTS.filter((p) => p.category === c).length);

  return (
    <section id="work" className="pb-24">
      <div className="sticky top-0 z-40 flex items-center gap-6 overflow-x-auto bg-gradient-to-b from-bg from-70% to-transparent px-5 pb-4 pt-[72px] text-sm md:px-8">
        {CATEGORIES.map((c) => (
          <button key={c} data-cursor="link" onClick={() => setCat(c)}
            className={`transition-colors ${c === cat ? "text-white underline decoration-1 underline-offset-[6px]" : "text-muted hover:text-white"}`}>
            {c}<sup className="ml-0.5 text-[10px]">{count(c)}</sup>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-0.5 px-0.5 md:grid-cols-2">
        {items.map((p) => <ProjectCard key={p.id} project={p} onOpen={setActive} />)}
      </div>

      <VideoModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
