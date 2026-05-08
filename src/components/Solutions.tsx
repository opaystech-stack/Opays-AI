import { motion } from "framer-motion";
import { FileText, MessageSquare, GitBranch } from "lucide-react";
import { SectionHeader } from "./Approche";

const items = [
  {
    icon: FileText,
    eyebrow: "Traitement intelligent",
    title: "Documents et données",
    text: "Nous aidons les entreprises à extraire, organiser et traiter les données contenues dans les factures, formulaires, contrats et autres supports opérationnels.",
  },
  {
    icon: MessageSquare,
    eyebrow: "Assistants de relation",
    title: "Communication automatisée",
    text: "Nous mettons en place des assistants capables de répondre, orienter et qualifier les demandes simples, notamment sur les canaux que vos clients utilisent déjà.",
  },
  {
    icon: GitBranch,
    eyebrow: "Automatisation des processus",
    title: "Workflows internes",
    text: "Nous relions vos outils entre eux pour que les tâches répétitives s'exécutent plus proprement, avec moins de relances manuelles et moins de pertes d'information.",
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
