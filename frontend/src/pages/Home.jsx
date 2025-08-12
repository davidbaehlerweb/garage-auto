import Header from "../components/Header";
import Carousel from "../components/Carousel";
import Services from "../components/Services";
import WhyUs from "../components/WhyUs";
import CTA from "../components/CTA";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

export default function Home() {
  const slides = [
    { src: slide1, alt: "Atelier mécanique", caption: "Entretien & réparations toutes marques" },
    { src: slide2, alt: "Véhicules d'occasion", caption: "Sélection de véhicules contrôlés et garantis" },
    { src: slide3, alt: "Diagnostic électronique", caption: "Outils de diagnostic dernière génération" },
  ];

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero plein écran */}
        <Carousel slides={slides} aspect="21/9" className="rounded-none shadow-none" />

        {/* Contenu d'accueil */}
        <Services />
        <WhyUs />
        <CTA />
      </main>
    </>
  );
}
