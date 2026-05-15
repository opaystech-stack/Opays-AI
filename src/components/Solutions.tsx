import { motion } from "framer-motion";
import { Shield, GitBranch, Layers } from "lucide-react";
import { SectionHeader } from "./Approche";

const items = [
  {
    icon: Shield,
    eyebrow: "Souveraineté numérique",
    title: "IA Privée & Souveraine",
    text: "Mise en place d'instances d'intelligence artificielle indépendantes, tournant sur votre infrastructure. Vous gardez la propriété totale de votre cerveau numérique.",
  },
  {
    icon: GitBranch,
    eyebrow: "Efficience accrue",
    title: "Automatisation Métier",
    text: "Suppression des goulots d'étranglement et coordination des flux critiques pour que vos opérations s'exécutent sans erreur et sans fatigue.",
  },
  {
    icon: Layers,
    eyebrow: "Stabilité & Fiabilité",
    title: "Systèmes Robustes",
    text: "Conception d'architectures technologiques résilientes qui s'intègrent à vos outils existants tout en assurant une continuité de service.",
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
