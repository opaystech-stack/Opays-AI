import { motion } from "framer-motion";
import { Beaker, Cpu, Globe } from "lucide-react";
import { SectionHeader } from "./Approche";

export function RD() {
  return (
    <section id="rd" className="py-28 relative bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              eyebrow="Recherche & Développement"
              title="L’intelligence adaptée au contexte."
            />
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Opays Tech n'est pas seulement un intégrateur ; nous sommes un laboratoire d'innovation. 
              Notre pôle R&D travaille quotidiennement sur l'adaptation des technologies d'IA aux 
              environnements les plus complexes.
            </p>
            
            <div className="mt-10 space-y-8">
              <Feature 
                icon={Cpu}
                title="Optimisation Infrastructurelle"
                text="Adaptation des modèles pour fonctionner sur des serveurs locaux avec des contraintes de bande passante ou d'énergie."
              />
              <Feature 
                icon={Globe}
                title="Intelligence Contextuelle"
                text="Travaux sur l'optimisation des modèles pour les données régionales et les spécificités linguistiques locales."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 glass p-8 flex items-center justify-center">
              <div className="relative h-full w-full rounded-2xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center group">
                 <Beaker size={120} className="text-primary/20 absolute group-hover:scale-110 transition-transform duration-700" />
                 <div className="relative z-10 text-center p-6">
                    <div className="text-4xl font-bold text-gradient mb-2">R&D Lab</div>
                    <div className="text-sm text-muted-foreground font-mono">Constant Innovation Cycle</div>
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,186,255,0.1),transparent_70%)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
