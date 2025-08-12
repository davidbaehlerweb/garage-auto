import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import DashboardContent from "../components/admin/DashboardContent";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({ total: 0, dispo: 0, indispo: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const headers = { Authorization: `Token ${token}` }; // JWT => `Bearer ${token}`

    fetch("http://127.0.0.1:8000/api/vehicules/", { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error("unauthorized");
        const list = await res.json();
        const dispo = list.filter(v => v.is_available).length;
        const indispo = list.length - dispo;
        setStats({ total: list.length, dispo, indispo });
        setRecent(list.slice(0, 5));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/admin/login");
      })
      .finally(() => setChecking(false));
  }, [navigate, token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="text-gray-600">Chargement du tableau de bord…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={username} onLogout={logout} />
      <DashboardContent stats={stats} recent={recent} />
    </div>
  );
}
