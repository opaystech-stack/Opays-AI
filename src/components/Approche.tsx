import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Lecture du terrain", text: "Nous observons comment le travail circule réellement dans votre entreprise, pas seulement comment il est censé circuler." },
  { n: "02", title: "Cartographie des frictions", text: "Nous repérons les pertes de temps, les doublons, les interruptions et les tâches qui consomment l'énergie des équipes." },
  { n: "03", title: "Construction de la solution", text: "Nous concevons un système adapté à vos outils, à votre rythme et à vos contraintes concrètes." },
  { n: "04", title: "Mise en service", text: "Nous testons, ajustons et suivons la solution pour qu'elle reste utile dans le temps." },
];

export function Approche() {
  return (
    <section id="approche" className="py-28 relative">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Notre méthode"
          title="Une méthode simple, mais rigoureuse."
          subtitle="Notre approche pragmatique pour transformer vos opérations."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl glass p-6 hover:border-primary/40 hover:-translate-y-1 transition-all"
            >
              <div className="font-mono text-xs text-[color:var(--neon-cyan)] mb-4">{s.n}</div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                   style={{ boxShadow: "var(--shadow-neon)" }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl"
    >
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--neon-cyan)] mb-4">
        {eyebrow}
      </div>
      <h2 className="text-3xl md:text-5xl font-bold leading-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}
