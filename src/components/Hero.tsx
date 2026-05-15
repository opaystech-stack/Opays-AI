import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { TerminalAnimation } from "./TerminalAnimation";

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50 -z-10" />
      <div className="absolute inset-0 bg-[var(--gradient-hero)] -z-10" />

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles size={14} className="text-[color:var(--neon-cyan)]" />
            Ingénierie de l'Efficience & Systèmes IA
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]">
            L'IA au service de votre <br />
            <span className="text-gradient text-4xl md:text-5xl lg:text-6xl">performance réelle.</span>
            <br />
            <span className="text-foreground/90 text-2xl md:text-3xl lg:text-4xl font-semibold block mt-4">
              Robuste. Locale. Souveraine.
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Nous aidons les entreprises à stabiliser et automatiser leurs opérations quotidiennes. Nous identifions vos goulots d'étranglement pour simplifier vos processus et bâtir des systèmes fiables qui protègent durablement votre savoir-faire.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-neon)] hover:shadow-[var(--shadow-glow)] hover:scale-[1.02] transition-all"
            >
              Réserver une consultance gratuite
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#approche"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:border-primary/50 transition-all"
            >
              Voir notre approche
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
              Des processus plus clairs
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--neon-cyan)]" />
              Moins de fatigue opérationnelle
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <TerminalAnimation />
        </motion.div>
      </div>
    </section>
  );
}
