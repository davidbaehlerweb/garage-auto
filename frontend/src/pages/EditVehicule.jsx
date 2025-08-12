import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditVehicule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage_km: "",
    fuel: "Essence",
    transmission: "Manuelle",
    description: "",
    is_available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // aperçu nouvelle image
  const [serverImage, setServerImage] = useState("");   // image actuelle (URL)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  // Charger le véhicule
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const load = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/vehicules/${id}/`);
        if (!res.ok) throw new Error("Impossible de charger le véhicule");
        const v = await res.json();
        setForm({
          make: v.make || "",
          model: v.model || "",
          year: v.year || "",
          price: v.price || "",
          mileage_km: v.mileage_km || "",
          fuel: v.fuel || "Essence",
          transmission: v.transmission || "Manuelle",
          description: v.description || "",
          is_available: !!v.is_available,
        });
        const raw = v.image_url || v.image || "";
        setServerImage(raw && raw.startsWith("http") ? raw : raw ? `http://127.0.0.1:8000${raw}` : "");
      } catch (e) {
        setError(e.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate, token]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onImage = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);

      // PATCH partiel
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (imageFile) {
        fd.append("image", imageFile, imageFile.name);
      }
      // Si tu veux permettre de supprimer l'image existante :
      // if (!imageFile && serverImage && wantRemove) fd.append("image", "");

      const res = await fetch(`http://127.0.0.1:8000/api/vehicules/${id}/`, {
        method: "PATCH",
        headers: { Authorization: `Token ${token}` }, // JWT => `Bearer ${token}`
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Échec de la sauvegarde");
      }

      const updated = await res.json();
      const raw = updated.image_url || updated.image || "";
      setServerImage(raw && raw.startsWith("http") ? raw : raw ? `http://127.0.0.1:8000${raw}` : "");
      setSuccessOpen(true);
      setImageFile(null); // reset l’état d’upload
    } catch (err) {
      setError(err.message || "Erreur serveur");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-gray-600">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre d’actions (sans header global) */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto h-14 px-4 sm:px-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-lg border px-3 h-10 text-sm font-medium hover:bg-gray-50"
          >
            ← Retour
          </button>
          <div className="font-semibold">Modifier le véhicule</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche : image actuelle + nouvelle image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border p-4 space-y-3">
              <div className="text-sm font-semibold">Photo actuelle</div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 grid place-items-center">
                {serverImage ? (
                  <img src={serverImage} alt="actuelle" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">Aucune image</span>
                )}
              </div>

              <div className="text-sm font-semibold pt-2">Nouvelle image (optionnel)</div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 grid place-items-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="aperçu" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">Aucun aperçu</span>
                )}
              </div>

              <label className="block">
                <input type="file" accept="image/*" onChange={onImage} className="hidden" />
                <span className="inline-flex items-center justify-center rounded-lg border px-4 h-10 text-sm font-medium hover:bg-gray-50 cursor-pointer">
                  Importer une image
                </span>
              </label>
              <p className="text-xs text-gray-500">JPEG/PNG (AVIF accepté si Pillow le supporte), ~5 Mo max.</p>
            </div>
          </div>

          {/* Colonne droite : champs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Marque *">
                  <input name="make" value={form.make} onChange={onChange} className="w-full border rounded-lg px-3 h-10" required />
                </Field>
                <Field label="Modèle *">
                  <input name="model" value={form.model} onChange={onChange} className="w-full border rounded-lg px-3 h-10" required />
                </Field>
                <Field label="Année *">
                  <input type="number" name="year" value={form.year} onChange={onChange} className="w-full border rounded-lg px-3 h-10" min="1950" max="2100" required />
                </Field>
                <Field label="Prix (CHF) *">
                  <input type="number" name="price" value={form.price} onChange={onChange} className="w-full border rounded-lg px-3 h-10" min="0" step="0.01" required />
                </Field>
                <Field label="Kilométrage (km)">
                  <input type="number" name="mileage_km" value={form.mileage_km} onChange={onChange} className="w-full border rounded-lg px-3 h-10" min="0" />
                </Field>
                <Field label="Carburant">
                  <select name="fuel" value={form.fuel} onChange={onChange} className="w-full border rounded-lg px-3 h-10">
                    <option>Essence</option>
                    <option>Diesel</option>
                    <option>Hybride</option>
                    <option>Électrique</option>
                  </select>
                </Field>
                <Field label="Transmission">
                  <select name="transmission" value={form.transmission} onChange={onChange} className="w-full border rounded-lg px-3 h-10">
                    <option>Manuelle</option>
                    <option>Auto</option>
                  </select>
                </Field>
                <Field label="Disponible">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" name="is_available" checked={form.is_available} onChange={onChange} className="h-4 w-4" />
                    <span className="text-sm text-gray-700">Oui</span>
                  </label>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Description">
                    <textarea name="description" value={form.description} onChange={onChange} rows={4} className="w-full border rounded-lg px-3 py-2" />
                  </Field>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate(-1)} className="rounded-lg border px-4 h-11 text-sm font-medium hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white px-5 h-11 text-sm font-semibold">
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL SUCCÈS */}
      {successOpen && (
        <Modal onClose={() => setSuccessOpen(false)}>
          <div className="text-center p-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 grid place-items-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600">
                <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Modifications enregistrées</h3>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={() => { setSuccessOpen(false); navigate("/admin/dashboard"); }} className="flex-1 rounded-lg bg-gray-900 text-white h-11 font-medium hover:opacity-90">
                Retour au dashboard
              </button>
              <button onClick={() => setSuccessOpen(false)} className="flex-1 rounded-lg border h-11 font-medium hover:bg-gray-50">
                Continuer l’édition
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      {children}
    </label>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
