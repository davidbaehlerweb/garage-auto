import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Vehicules from "./pages/Vehicules";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NewVehicule from "./pages/NewVehicule";        // <-- ajoute ça
import ProtectedRoute from "./components/ProtectedRoute";
import EditVehicule from "./pages/EditVehicule";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import AdminContacts from "./components/admin/AdminContacts";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vehicules" element={<Vehicules />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/vehicules/nouveau"
        element={
          <ProtectedRoute>
            <NewVehicule />
          </ProtectedRoute>
        }
      />

      <Route
  path="/admin/vehicules/:id/edit"
  element={
    <ProtectedRoute>
      <EditVehicule /> {/* à créer, proche de NewVehicule mais en PATCH/PUT */}
    </ProtectedRoute>
  }
/>
 <Route path="/services" element={<Services />} />
<Route path="/contact" element={<Contact />} />
  <Route path="/admin/contacts" element={<AdminContacts />} />

  </Routes>
  );
}
