import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* Récupère TOUTES les pages DRF */
const fetchAllVehicules = async (baseUrl, headers) => {
  let next = baseUrl;
  let all = [];
  while (next) {
    const res = await fetch(next, { headers });
    if (res.status === 401 || res.status === 403) throw new Error("auth");
    if (!res.ok) throw new Error("http " + res.status);
    const data = await res.json();
    if (Array.isArray(data)) return data; // backend non paginé
    all = all.concat(data.results || []);
    next = data.next; // URL de la page suivante (ou null)
  }
  return all;
};

export default function DashboardContent({ stats, recent }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // État
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState(null);

  // Filtres locaux
  const [q, setQ] = useState("");
  const [ordering, setOrdering] = useState("-created_at"); // local

  const headers = useMemo(
    () => (token ? { Authorization: `Token ${token}` } : {}),
    [token]
  );

  // état "export"
const [exporting, setExporting] = useState(false);

const toCsv = (rows) => {
  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    // échappe " et entoure de guillemets si nécessaire
    if (/[",;\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return rows.map((r) => r.map(esc).join(";")).join("\n");
};

const handleExport = async () => {
  if (!token) return navigate("/admin/login");
  try {
    setExporting(true);
    // récupère TOUTES les pages
    const baseUrl = "http://127.0.0.1:8000/api/vehicules/";
    const all = await fetchAllVehicules(baseUrl, headers);

    // entêtes + données
    const headersRow = [
      "id","marque","modele","annee","prix","km",
      "carburant","boite","disponible","cree_le","image_url"
    ];
    const dataRows = all.map(v => [
      v.id,
      v.make,
      v.model,
      v.year,
      v.price,
      v.mileage_km,
      v.fuel,
      v.transmission,
      v.is_available ? "oui" : "non",
      v.created_at,
      v.image_url || v.image || ""
    ]);

    const csv = toCsv([headersRow, ...dataRows]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0,10);
    a.href = url;
    a.download = `inventaire_vehicules_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    alert("Échec de l’export CSV.");
  } finally {
    setExporting(false);
  }
};


  // Charge TOUS les véhicules au chargement
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const run = async () => {
      setLoading(true);
      try {
        const url = new URL("http://127.0.0.1:8000/api/vehicules/");
        const list = await fetchAllVehicules(url.toString(), headers);
        setItems(list);
      } catch (e) {
        if (e.message === "auth") {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/admin/login");
        } else {
          console.error(e);
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token, navigate, headers]);

  // Filtrage + tri en local
  const shown = useMemo(() => {
    let list = [...items];

    // recherche make/model
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (v) =>
          (v.make || "").toLowerCase().includes(s) ||
          (v.model || "").toLowerCase().includes(s)
      );
    }

    // tri local
    const byNum = (k) => (a, b) => Number(a[k] || 0) - Number(b[k] || 0);
    const byDate = (k) => (a, b) => new Date(a[k] || 0) - new Date(b[k] || 0);

    switch (ordering) {
      case "created_at":
        list.sort(byDate("created_at"));
        break;
      case "-created_at":
        list.sort((a, b) => byDate("created_at")(b, a));
        break;
      case "price":
        list.sort(byNum("price"));
        break;
      case "-price":
        list.sort((a, b) => byNum("price")(b, a));
        break;
      case "year":
        list.sort(byNum("year"));
        break;
      case "-year":
        list.sort((a, b) => byNum("year")(b, a));
        break;
      case "mileage_km":
        list.sort(byNum("mileage_km"));
        break;
      case "-mileage_km":
        list.sort((a, b) => byNum("mileage_km")(b, a));
        break;
      default:
        break;
    }

    return list;
  }, [items, q, ordering]);

  const getImageUrl = (v) => {
    const raw = v.image_url || v.image || "";
    if (!raw) return null;
    return raw.startsWith("http") ? raw : `http://127.0.0.1:8000${raw}`;
  };

  const openConfirm = (vehicule) => {
    setTarget(vehicule);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!token || !target) return;
    try {
      setBusyId(target.id);
      const res = await fetch(`http://127.0.0.1:8000/api/vehicules/${target.id}/`, {
        method: "DELETE",
        headers,
      });
      if (res.status !== 204) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Échec de la suppression");
      }
      setItems((arr) => arr.filter((x) => x.id !== target.id));
      setConfirmOpen(false);
      setTarget(null);
    } catch (e) {
      alert(e.message || "Erreur lors de la suppression");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-20 self-start">
        <nav className="bg-white rounded-2xl border p-3 space-y-1">
          <Link to="/admin/dashboard" className="block px-3 py-2 rounded-lg bg-gray-100 font-medium">
            Tableau de bord
          </Link>
          <Link to="/admin/vehicules/nouveau" className="block px-3 py-2 rounded-lg hover:bg-gray-50">
            Ajouter un véhicule
          </Link>
          <Link to="/vehicules" className="block px-3 py-2 rounded-lg hover:bg-gray-50">
            Voir la liste publique
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="space-y-6">
        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Véhicules" value={stats.total} />
          <StatCard label="Disponibles" value={stats.dispo} accent="text-green-600" />
          <StatCard label="Indisponibles" value={stats.indispo} accent="text-red-600" />
        </section>

        {/* Actions rapides */}
        <section className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Actions rapides</h2>
            <Link
              to="/admin/vehicules/nouveau"
              className="inline-flex items-center rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white px-4 h-10 text-sm font-medium"
            >
              + Nouveau véhicule
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <QuickAction to="/admin/vehicules/nouveau" title="Ajouter un véhicule" desc="Créer une fiche avec photos, prix…" />
            <QuickAction to="/vehicules" title="Vérifier la vitrine" desc="Voir le rendu côté public" />
            <QuickAction
  title="Exporter l’inventaire"
  desc={exporting ? "Génération…" : "CSV de l’inventaire"}
  onClick={handleExport}
  disabled={exporting}
/>

          </div>
        </section>

        {/* Liste véhicules (toujours complète) */}
        <section className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between gap-3">
            <h2 className="font-semibold">Tous les véhicules (admin)</h2>
            <div className="flex items-center gap-2">
              <input
                className="border rounded-lg px-3 h-9 w-48"
                placeholder="Recherche…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="border rounded-lg px-2 h-9"
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
              >
                <option value="-created_at">Plus récents</option>
                <option value="created_at">Plus anciens</option>
                <option value="-price">Prix ↓</option>
                <option value="price">Prix ↑</option>
                <option value="-year">Année ↓</option>
                <option value="year">Année ↑</option>
                <option value="-mileage_km">Km ↓</option>
                <option value="mileage_km">Km ↑</option>
              </select>
            </div>
          </div>

          <div className="divide-y">
            {loading ? (
              <div className="p-5 text-gray-500">Chargement…</div>
            ) : shown.length === 0 ? (
              <div className="p-5 text-gray-500">Aucun véhicule.</div>
            ) : (
              shown.map((v) => {
                const imageUrl = getImageUrl(v);
                return (
                  <div key={v.id} className="p-5 flex items-center gap-4">
                    <div className="h-16 w-24 bg-gray-100 rounded overflow-hidden shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${v.make} ${v.model}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml;charset=UTF-8," +
                              encodeURIComponent(
                                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120'>
                                   <rect width='100%' height='100%' fill='#f3f4f6'/>
                                   <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                                         fill='#9ca3af' font-size='12'>Aperçu</text>
                                 </svg>`
                              );
                          }}
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-gray-400 text-sm">Aperçu</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {v.make} {v.model} • <span className="text-gray-500">{v.year}</span>
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {Number(v.price || 0).toLocaleString()} CHF • {v.mileage_km?.toLocaleString() || 0} km • {v.fuel}
                      </div>
                    </div>

                    <div className="ml-auto flex items-center gap-3 shrink-0 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded ${v.is_available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                        {v.is_available ? "Disponible" : "Indispo"}
                      </span>

                      <Link
                        to={`/admin/vehicules/${v.id}/edit`}
                        className="rounded-lg border px-3 h-9 text-sm hover:bg-gray-50"
                        title="Modifier"
                      >
                        Modifier
                      </Link>

                      <button
                        onClick={() => openConfirm(v)}
                        disabled={busyId === v.id}
                        className="rounded-lg border px-3 h-9 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                        title="Supprimer"
                      >
                        {busyId === v.id ? "Suppression…" : "Supprimer"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Modale confirmation */}
      {confirmOpen && target && (
        <ConfirmDeleteModal
          vehicule={target}
          imageUrl={getImageUrl(target)}
          onCancel={() => {
            setConfirmOpen(false);
            setTarget(null);
          }}
          onConfirm={confirmDelete}
          loading={busyId === target.id}
        />
      )}
    </div>
  );
}

/* --- UI helpers --- */
function StatCard({ label, value, accent = "text-gray-900" }) {
  return (
    <div className="bg-white rounded-2xl border p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-3xl font-extrabold mt-1 ${accent}`}>{value}</div>
    </div>
  );
}

function QuickAction({ to, title, desc, disabled, onClick }) {
  const base = "rounded-xl border p-4 hover:shadow transition block text-left";
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${base} w-full disabled:opacity-60`}
      >
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </button>
    );
  }
  if (disabled) {
    return (
      <div className={`${base} opacity-60 cursor-not-allowed`}>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </div>
    );
  }
  return (
    <Link to={to} className={base}>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600">{desc}</div>
    </Link>
  );
}


function ConfirmDeleteModal({ vehicule, imageUrl, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="h-12 w-16 bg-gray-100 rounded overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-gray-400 text-xs">Aperçu</div>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">
                {vehicule.make} {vehicule.model}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {vehicule.year} • {Number(vehicule.price || 0).toLocaleString()} CHF
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-700">
              Voulez-vous vraiment <span className="font-semibold">supprimer</span> ce véhicule ?<br />
              Cette action est <span className="font-semibold text-red-600">définitive</span>.
            </p>
          </div>

          <div className="p-4 flex gap-3 justify-end border-t bg-gray-50">
            <button
              onClick={onCancel}
              className="rounded-lg border px-4 h-10 text-sm font-medium hover:bg-white"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 h-10 text-sm font-semibold"
            >
              {loading ? "Suppression…" : "Supprimer définitivement"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
