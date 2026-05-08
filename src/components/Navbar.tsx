import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoIcon from "@/assets/opays-icon.png";

const items = [
  { label: "Approche", href: "#approche" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pourquoi nous", href: "#pourquoi" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/60 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5 group">
          <img src={logoIcon} alt="Opays Tech" className="h-8 w-8 transition-transform group-hover:scale-110" />
          <span className="font-display text-base font-semibold tracking-tight">
            OPAYS <span className="text-gradient">TECH</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gradient-to-r after:from-accent after:to-primary hover:after:w-full after:transition-all"
            >
              {it.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center justify-center rounded-full glass px-5 py-2 text-sm font-medium text-foreground hover:shadow-[var(--shadow-neon)] hover:border-primary/50 transition-all"
        >
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--neon-cyan)] animate-pulse" />
          Audit gratuit
        </a>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/90 backdrop-blur-xl px-6 py-4 space-y-3">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              {it.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-full glass px-4 py-2 text-sm"
          >
            Audit gratuit
          </a>
        </div>
      )}
    </header>
  );
}
