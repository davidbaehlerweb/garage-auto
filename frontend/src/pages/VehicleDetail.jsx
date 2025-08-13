import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";

export default function VehicleDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/vehicules/${id}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCar(data);
      } catch (e) {
        setErr(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const img = (() => {
    const raw = car?.image_url || car?.image || "";
    if (!raw) return null;
    return raw.startsWith("http") ? raw : `http://127.0.0.1:8000${raw}`;
  })();

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/vehicules" className="text-sm text-yellow-700 hover:underline">
            ← Retour à la liste
          </Link>

          {loading && <div className="mt-6 text-gray-600">Chargement…</div>}
          {err && <div className="mt-6 text-red-600">Erreur : {err}</div>}

          {car && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl overflow-hidden border bg-gray-50">
                {img ? (
                  <img
                    src={img}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;charset=UTF-8," +
                        encodeURIComponent(
                          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>
                             <rect width='100%' height='100%' fill='#f3f4f6'/>
                             <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                                   fill='#9ca3af' font-family='system-ui, sans-serif' font-size='22'>
                               Image non disponible
                             </text>
                           </svg>`
                        );
                    }}
                  />
                ) : (
                  <div className="aspect-[4/3] grid place-items-center text-gray-400">Aucune image</div>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-extrabold">
                  {car.make} {car.model} <span className="text-gray-500">• {car.year}</span>
                </h1>

                <div className="mt-3 text-2xl font-bold text-yellow-600">
                  {Number(car.price).toLocaleString()} CHF
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Info label="Kilométrage" value={`${Number(car.mileage_km || 0).toLocaleString()} km`} />
                  <Info label="Carburant" value={car.fuel} />
                  <Info label="Transmission" value={car.transmission} />
                  <Info label="Disponibilité" value={car.is_available ? "Disponible" : "Indisponible"} />
                  <Info label="Créé le" value={new Date(car.created_at).toLocaleString()} />
                </div>

                {car.description && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold">Description</h2>
                    <p className="mt-2 text-gray-700 whitespace-pre-line">{car.description}</p>
                  </div>
                )}

                <div className="mt-8 flex gap-3">
                  <Link
                    to="/contact"
                    className="rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white px-5 h-11 text-sm font-semibold inline-flex items-center"
                  >
                    Prendre rendez-vous
                  </Link>
                  <Link
                    to="/vehicules"
                    className="rounded-lg border px-5 h-11 text-sm font-medium inline-flex items-center hover:bg-gray-50"
                  >
                    Retour
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border p-4 bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
