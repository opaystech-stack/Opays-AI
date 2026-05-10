import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Approche } from "@/components/Approche";
import { Solutions } from "@/components/Solutions";
import { RD } from "@/components/RD";
import { Vision } from "@/components/Vision";
import { PourquoiNous } from "@/components/PourquoiNous";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <Approche />
        <Solutions />
        <RD />
        <PourquoiNous />
        <Vision />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
