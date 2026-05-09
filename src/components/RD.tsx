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
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 glass p-8 flex items-center justify-center relative">
              {/* Pulsing rings background */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2, opacity: [0, 0.1, 0] }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      delay: i * 1.3,
                      ease: "easeOut"
                    }}
                    className="absolute h-40 w-40 rounded-full border border-primary/40"
                  />
                ))}
              </div>

              <div className="relative h-full w-full rounded-2xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center group shadow-2xl">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="absolute h-[150%] w-[150%] opacity-20"
                   style={{ 
                     background: "conic-gradient(from 0deg, transparent, var(--neon-cyan), transparent 30%)" 
                   }}
                 />
                 
                 <div className="relative z-10 text-center p-6">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Beaker size={80} className="text-primary mb-4 mx-auto drop-shadow-[0_0_15px_rgba(0,186,255,0.5)]" />
                    </motion.div>
                    <div className="text-3xl font-bold text-white mb-2 tracking-tight">R&D Lab</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">Active Innovation Cycle</span>
                    </div>
                 </div>

                 {/* Particle effects */}
                 {[...Array(6)].map((_, i) => (
                   <motion.div
                     key={i}
                     initial={{ x: Math.random() * 200 - 100, y: Math.random() * 200 - 100, opacity: 0 }}
                     animate={{ 
                       x: [null, Math.random() * 200 - 100], 
                       y: [null, Math.random() * 200 - 100],
                       opacity: [0, 0.5, 0] 
                     }}
                     transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
                     className="absolute h-1 w-1 bg-primary rounded-full blur-[1px]"
                   />
                 ))}
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
