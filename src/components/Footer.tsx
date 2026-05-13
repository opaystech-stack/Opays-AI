import logoIcon from "@/assets/opays-icon.png";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <img src={logoIcon} alt="Opays Tech" className="h-7 w-7" style={{ mixBlendMode: 'screen' }} />
          <span className="font-display text-sm font-semibold">
            OPAYS <span className="text-gradient">TECH</span>
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#approche" className="hover:text-foreground transition-colors">Approche</a>
          <a href="#solutions" className="hover:text-foreground transition-colors">Solutions</a>
          <a href="#pourquoi" className="hover:text-foreground transition-colors">Pourquoi nous</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
        </nav>
        <div className="text-xs text-muted-foreground">© 2024 Opays Tech. All rights reserved.</div>
      </div>
    </footer>
  );
}
