import { motion } from "framer-motion";
import { SectionHeader } from "./Approche";

const reasons = [
  {
    n: "01",
    title: "Compréhension du terrain",
    text: "Nous savons que la réalité d'une entreprise ne se résume pas à un beau schéma. Les contraintes, les habitudes et les outils existants comptent autant que la solution elle-même.",
  },
  {
    n: "02",
    title: "Approche pragmatique",
    text: "Nous ne cherchons pas à tout remplacer. Nous améliorons ce qui existe déjà quand c'est la meilleure option.",
  },
  {
    n: "03",
    title: "Exécution claire",
    text: "Nous avançons avec une logique simple : observer, structurer, installer, ajuster.",
  },
  {
    n: "04",
    title: "Vision élevée",
    text: "Opays Tech est pensé pour répondre à des besoins concrets, avec un niveau d'exigence élevé et une vraie compréhension de ce que les équipes vivent au quotidien.",
  },
];

export function PourquoiNous() {
  return (
    <section id="pourquoi" className="py-28 relative">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Pourquoi nous" title="Travailler avec Opays Tech." />

        <div className="mt-16 grid md:grid-cols-2 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">
          {reasons.map((r, i) => (
            <motion.div
              key={r.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card p-8 hover:bg-card/70 transition-colors group"
            >
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-mono text-xs text-[color:var(--neon-cyan)]">{r.n}</span>
                <h3 className="text-xl font-semibold group-hover:text-gradient transition-all">
                  {r.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
