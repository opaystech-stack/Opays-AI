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
    <header className="fixed inset-x-0 top-6 z-50 px-6">
      <div className="mx-auto max-w-5xl rounded-full border border-white/10 bg-background/20 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300">
        <div className="flex h-12 items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2 group shrink-0">
            <img src={logoIcon} alt="Opays Tech" className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="font-display text-sm font-semibold tracking-tight">
              OPAYS <span className="text-gradient">TECH</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {items.map((it) => (
              <a
                key={it.href}
                href={it.href}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all"
              >
                {it.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href="#contact"
              className="hidden md:inline-flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-primary/20 hover:border-primary/40 transition-all"
            >
              Consultance gratuite
            </a>

            <button
              className="md:hidden text-foreground p-1"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>


      {open && (
        <div className="md:hidden mt-2 rounded-2xl border border-white/10 bg-background/90 backdrop-blur-xl p-4 space-y-3 shadow-xl">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground px-2 py-1"
            >
              {it.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-semibold text-foreground"
          >
            Consultance gratuite
          </a>
        </div>
      )}
    </header>
  );
}
