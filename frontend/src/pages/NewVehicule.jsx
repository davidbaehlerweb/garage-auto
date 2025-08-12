import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewVehicule() {
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
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [created, setCreated] = useState(null);

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

    if (!token) {
      setError("Session expirée. Merci de vous reconnecter.");
      navigate("/admin/login");
      return;
    }
    if (!form.make || !form.model || !form.year || !form.price) {
      setError("Merci de remplir au minimum Marque, Modèle, Année et Prix.");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) {
        // ENVOI AVEC FILENAME -> indispensable pour DRF + Pillow
        fd.append("image", imageFile, imageFile.name);
      }

      const res = await fetch("http://127.0.0.1:8000/api/vehicules/", {
        method: "POST",
        headers: { Authorization: `Token ${token}` }, // si JWT: `Bearer ${token}`
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Erreur lors de l’enregistrement");
      }

      const createdVehicule = await res.json();
      setCreated(createdVehicule);
      setImagePreview(createdVehicule.image_url || "");
      setSuccessOpen(true);
    } catch (err) {
      setError(err.message || "Erreur serveur");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
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
    setImageFile(null);
    setImagePreview("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre d’actions */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto h-14 px-4 sm:px-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-lg border px-3 h-10 text-sm font-medium hover:bg-gray-50"
          >
            ← Retour
          </button>
          <div className="font-semibold">Nouveau véhicule</div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche : image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border p-4">
              <div className="text-sm font-semibold mb-3">Photo principale</div>

              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 grid place-items-center mb-3">
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
              <p className="text-xs text-gray-500 mt-2">JPEG/PNG, ~5 Mo max.</p>
            </div>
          </div>

          {/* Colonne droite : champs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Marque *">
                  <input
                    name="make"
                    value={form.make}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 h-10"
                    placeholder="BMW, Audi…"
                    required
                  />
                </Field>
                <Field label="Modèle *">
                  <input
                    name="model"
                    value={form.model}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 h-10"
                    placeholder="M3, A4…"
                    required
                  />
                </Field>
                <Field label="Année *">
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 h-10"
                    placeholder="2020"
                    min="1950"
                    max="2100"
                    required
                  />
                </Field>
                <Field label="Prix (CHF) *">
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 h-10"
                    placeholder="32900"
                    min="0"
                    step="0.01"
                    required
                  />
                </Field>
                <Field label="Kilométrage (km)">
                  <input
                    type="number"
                    name="mileage_km"
                    value={form.mileage_km}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 h-10"
                    placeholder="52000"
                    min="0"
                  />
                </Field>
                <Field label="Carburant">
                  <select
                    name="fuel"
                    value={form.fuel}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 h-10"
                  >
                    <option>Essence</option>
                    <option>Diesel</option>
                    <option>Hybride</option>
                    <option>Électrique</option>
                  </select>
                </Field>
                <Field label="Transmission">
                  <select
                    name="transmission"
                    value={form.transmission}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 h-10"
                  >
                    <option>Manuelle</option>
                    <option>Auto</option>
                  </select>
                </Field>
                <Field label="Disponible">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={form.is_available}
                      onChange={onChange}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">Oui</span>
                  </label>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Description">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={onChange}
                      rows={4}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Détails, options, entretien…"
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg border px-4 h-11 text-sm font-medium hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white px-5 h-11 text-sm font-semibold"
              >
                {saving ? "Enregistrement..." : "Enregistrer le véhicule"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL DE SUCCÈS */}
      {successOpen && (
        <Modal onClose={() => setSuccessOpen(false)}>
          <div className="text-center p-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 grid place-items-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600">
                <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Véhicule ajouté</h3>
            <p className="mt-1 text-sm text-gray-600">
              {created ? `${created.make} ${created.model} • ${created.year}` : "L’élément a été créé avec succès."}
            </p>

            {created?.image_url && (
              <div className="mt-4">
                <img
                  src={created.image_url}
                  alt={`${created.make} ${created.model}`}
                  className="mx-auto rounded-lg max-h-40 object-cover"
                />
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSuccessOpen(false);
                  navigate("/vehicules");
                }}
                className="flex-1 rounded-lg bg-gray-900 text-white h-11 font-medium hover:opacity-90"
              >
                Voir dans la liste
              </button>
              <button
                onClick={() => {
                  setSuccessOpen(false);
                  resetForm();
                }}
                className="flex-1 rounded-lg border h-11 font-medium hover:bg-gray-50"
              >
                Ajouter un autre
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* --- mini composant champ --- */
function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      {children}
    </label>
  );
}

/* --- Modal simple Tailwind --- */
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
