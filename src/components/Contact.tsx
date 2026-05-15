import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "./Approche";

export function Contact() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Demande envoyée — nous vous recontactons sous 24h.");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch (error) {
      toast.error("Un problème est survenu. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 relative">
      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-6">
            <span className="material-symbols-outlined text-[color:var(--neon-cyan)]">●</span>
          </div>
          <SectionHeader eyebrow="Nexus Access" title="Engagez la Forge. Sécurisez votre Souveraineté." />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Opays Tech n'est pas un prestataire, c'est votre unité d'ingénierie systémique. 
            Que vous ayez besoin de performance immédiate (**Forge**) ou d'innovation stratégique (**Sovereign**), 
            parlons de votre prochain saut technologique.
          </p>
          <div className="mt-8 space-y-4">
            <Bullet>Analyse de vos flux par nos ingénieurs Nexus</Bullet>
            <Bullet>Audit de souveraineté numérique (Data & IA)</Bullet>
            <Bullet>Simulation de ROI opérationnel gratuite</Bullet>
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl glass p-8 space-y-5 shadow-[var(--shadow-glow)]"
        >
          <Field label="Entreprise / Organisation" name="company" placeholder="Acme Corp" />
          
          <div className="space-y-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block">Votre axe de priorité</span>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 p-4 rounded-xl border border-border bg-background/20 cursor-pointer hover:border-primary/40 transition-all has-[:checked]:border-primary/60 has-[:checked]:bg-primary/5">
                <input type="radio" name="axe" value="forge" className="sr-only" defaultChecked />
                <span className="text-sm font-bold text-foreground">FORGE</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Performance</span>
              </label>
              <label className="flex flex-col gap-1 p-4 rounded-xl border border-border bg-background/20 cursor-pointer hover:border-primary/40 transition-all has-[:checked]:border-primary/60 has-[:checked]:bg-primary/5">
                <input type="radio" name="axe" value="sovereign" className="sr-only" />
                <span className="text-sm font-bold text-foreground">SOVEREIGN</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Innovation</span>
              </label>
            </div>
          </div>

          <Field
            label="Votre vision du projet"
            name="process"
            placeholder="Décrivez votre besoin technique ou stratégique..."
            textarea
          />
          <Field label="Email Professionnel" name="contact" placeholder="expert@entreprise.com" type="email" />

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-[var(--shadow-neon)] hover:shadow-[var(--shadow-glow)] hover:scale-[1.01] transition-all disabled:opacity-60"
          >
            {loading ? "Initialisation..." : <>Activer la consultance <Send size={16} /></>}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]" />
      {children}
    </div>
  );
}

function Field({
  label, name, placeholder, type = "text", textarea,
}: { label: string; name: string; placeholder?: string; type?: string; textarea?: boolean }) {
  const cls =
    "w-full rounded-lg border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
        {label}
      </span>
      {textarea ? (
        <textarea name={name} placeholder={placeholder} rows={3} className={cls} required />
      ) : (
        <input name={name} type={type} placeholder={placeholder} className={cls} required />
      )}
    </label>
  );
}
