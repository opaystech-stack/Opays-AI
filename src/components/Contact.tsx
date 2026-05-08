import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "./Approche";

export function Contact() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Demande envoyée — nous vous recontactons sous 24h.");
      (e.target as HTMLFormElement).reset();
    }, 800);
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
          <SectionHeader eyebrow="Contact" title="Parlons de vos blocages opérationnels." />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Si votre équipe perd du temps sur des tâches répétitives, des relances, des saisies
            ou des échanges mal structurés, nous pouvons vous aider à voir plus clair.
          </p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl glass p-8 space-y-5 shadow-[var(--shadow-glow)]"
        >
          <Field label="Nom de l'entreprise" name="company" placeholder="Acme Corp" />
          <Field label="Votre rôle" name="role" placeholder="Directeur des opérations" />
          <Field
            label="Le processus qui vous prend le plus de temps aujourd'hui"
            name="process"
            placeholder="Ex: traitement des factures fournisseurs"
            textarea
          />
          <Field label="Email ou téléphone" name="contact" placeholder="vous@entreprise.com" type="email" />

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-neon)] hover:shadow-[var(--shadow-glow)] hover:scale-[1.01] transition-all disabled:opacity-60"
          >
            {loading ? "Envoi..." : <>Demander une consultance <Send size={16} /></>}
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
