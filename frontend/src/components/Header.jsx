import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // <-- import du logo

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-gray-700 hover:text-yellow-500 transition-colors font-medium"
      onClick={() => setOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur bg-white/80 transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Garage Auto"
            className="h-10 w-auto object-contain"
          />
          <span className="font-bold text-lg text-gray-800">Garage Auto</span>
        </Link>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/vehicules">Véhicules</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* Bouton RDV (desktop) */}
        <div className="hidden md:flex">
          <Link
            to="/contact"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Prendre RDV
          </Link>
        </div>

        {/* Burger menu mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                open
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col p-4 gap-4">
            <NavLink to="/">Accueil</NavLink>
            <NavLink to="/vehicules">Véhicules</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <Link
              to="/contact"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition text-center"
            >
              Prendre RDV
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
