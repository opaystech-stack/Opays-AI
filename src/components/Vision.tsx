import { motion } from "framer-motion";
import { Landmark, Zap, ShieldCheck } from "lucide-react";
import { SectionHeader } from "./Approche";

export function Vision() {
  return (
    <section id="vision" className="py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-20">
          <SectionHeader
            eyebrow="Vision 2030"
            title="Bâtir l'indépendance numérique."
          />
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre vision dépasse le logiciel. Nous construisons les fondations d'une 
            infrastructure IA souveraine pour garantir l'autonomie technologique de demain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <VisionCard 
            icon={Landmark}
            title="Infrastructure Locale"
            text="Projeter le déploiement de capacités de calcul souveraines (Data Centers) pour un traitement local et sécurisé."
          />
          <VisionCard 
            icon={ShieldCheck}
            title="Autonomie Totale"
            text="Libérer les organisations de la dépendance aux infrastructures et aux abonnements technologiques étrangers."
          />
          <VisionCard 
            icon={Zap}
            title="Savoir-faire National"
            text="Entraîner et spécialiser les modèles de demain directement sur le sol national pour une maîtrise technologique absolue."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 p-8 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 text-center"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-4">Notre engagement</p>
          <h3 className="text-2xl font-bold mb-4">Une trajectoire vers la souveraineté complète.</h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Nous préparons le terrain pour un écosystème où l'intelligence n'est plus importée, mais produite et hébergée localement pour une sécurité et une performance sans compromis.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function VisionCard({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-primary/20 transition-colors"
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Icon size={24} className="text-primary" />
      </div>
      <h4 className="text-lg font-semibold mb-3">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </motion.div>
  );
}
