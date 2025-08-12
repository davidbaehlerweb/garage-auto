import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"; // <-- chemin vers ton logo

export default function AdminHeader({ username, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo + titre */}
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Logo Garage" 
            className="h-9 w-auto object-contain"
          />
          <div className="font-bold">Garage Admin</div>
        </Link>
        <Link to="/admin/contacts" className="block px-3 py-2 rounded-lg hover:bg-gray-50">
  Demandes de contact
</Link>


        {/* Bouton Déconnexion */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Bonjour, {username || "Admin"}
          </span>
          <button
            onClick={onLogout}
            className="rounded-lg border px-3 h-10 text-sm font-medium hover:bg-gray-50"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
