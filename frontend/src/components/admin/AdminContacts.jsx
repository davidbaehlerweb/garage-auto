import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminHeader";


export default function AdminContacts() {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [view, setView] = useState(null); // item à afficher dans la modale

  const headers = token ? { Authorization: `Token ${token}` } : {};

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/contacts/", { headers });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette demande ?")) return;
    try {
      setBusyId(id);
      const res = await fetch(`http://127.0.0.1:8000/api/contacts/${id}/`, {
        method: "DELETE",
        headers,
      });
      if (res.status !== 204) throw new Error("Échec de la suppression");
      setItems((arr) => arr.filter((x) => x.id !== id));
    } catch (e) {
      alert(e.message || "Erreur");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Demandes de contact</h1>
          <Link to="/admin/dashboard" className="text-sm text-gray-600 hover:underline">
            ← Retour dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-5 py-3 border-b text-sm text-gray-600">
            Total : {items.length}
          </div>

          {loading ? (
            <div className="p-6 text-gray-500">Chargement…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-gray-500">Aucune demande pour le moment.</div>
          ) : (
            <ul className="divide-y">
              {items.map((c) => (
                <li key={c.id} className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {c.name} • <span className="text-gray-500">{c.email}</span>
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {c.phone} • {new Date(c.created_at).toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => setView(c)}
                    className="rounded-lg border px-3 h-9 text-sm hover:bg-gray-50"
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={busyId === c.id}
                    className="rounded-lg border px-3 h-9 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    {busyId === c.id ? "Suppression…" : "Supprimer"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {view && (
        <Modal onClose={() => setView(null)}>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Demande de {view.name}</h3>
            <div className="text-sm text-gray-600">
              <div><span className="font-medium">Email:</span> {view.email}</div>
              <div><span className="font-medium">Téléphone:</span> {view.phone}</div>
              <div><span className="font-medium">Reçue:</span> {new Date(view.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-3 rounded-lg border p-3 text-sm whitespace-pre-wrap">
              {view.message}
            </div>
            <div className="pt-3 flex justify-end">
              <button onClick={() => setView(null)} className="rounded-lg border px-4 h-10 text-sm hover:bg-gray-50">
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
