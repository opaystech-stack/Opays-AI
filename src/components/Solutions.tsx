import { motion } from "framer-motion";
import { Shield, GitBranch, Layers } from "lucide-react";
import { SectionHeader } from "./Approche";

const items = [
  {
    icon: Shield,
    eyebrow: "Souveraineté numérique",
    title: "IA Open Source & Clonage",
    text: "Sélection et ré-entraînement de modèles mondiaux pour créer des instances privées, indépendantes et parfaitement adaptées à votre patrimoine de données.",
  },
  {
    icon: GitBranch,
    eyebrow: "Fluidité opérationnelle",
    title: "Automatisation des processus",
    text: "Suppression des tâches répétitives et coordination intelligente des flux pour que vos opérations critiques s'exécutent avec une précision totale.",
  },
  {
    icon: Layers,
    eyebrow: "Structure & Performance",
    title: "Architecture & Intégration",
    text: "Construction de ponts robustes entre vos données et vos outils, garantissant une intégration de l'IA sans friction dans votre écosystème existant.",
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="py-28 relative">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Solutions"
          title="Les domaines où nous apportons le plus de clarté."
        />

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative rounded-2xl glass p-8 hover:border-primary/40 hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-6">
                  <it.icon size={22} className="text-[color:var(--neon-cyan)]" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  {it.eyebrow}
                </div>
                <h3 className="text-xl font-semibold mb-3">{it.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{it.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
