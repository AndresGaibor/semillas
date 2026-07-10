import { createFileRoute } from "@tanstack/react-router";
import "../estilos.css";
import "../landing.css";
import { Navbar } from "@/features/landing/componentes/Navbar";
import { HeroSection } from "@/features/landing/componentes/HeroSection";
import { PathsSection } from "@/features/landing/componentes/PathsSection";
import { FeaturesSection } from "@/features/landing/componentes/FeaturesSection";
import { ClubesSection } from "@/features/landing/componentes/ClubesSection";
import { MethodologySection } from "@/features/landing/componentes/MethodologySection";
import { Footer } from "@/features/landing/componentes/Footer";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="landing-wrapper">
      <Navbar />

      <main className="main-content">
        <HeroSection />
        <PathsSection />
        <hr className="section-divider" />
        <FeaturesSection />
        <ClubesSection />
        <MethodologySection />
      </main>

      <Footer />
    </div>
  );
}
