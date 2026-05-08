import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Approche } from "@/components/Approche";
import { Solutions } from "@/components/Solutions";
import { PourquoiNous } from "@/components/PourquoiNous";
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
        <PourquoiNous />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
