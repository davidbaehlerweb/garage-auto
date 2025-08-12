import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";

export default function Contact() {
  // petit captcha: a + b = ?
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const refreshCaptcha = () => {
    setA(Math.floor(Math.random() * 6) + 2); // 2..7
    setB(Math.floor(Math.random() * 6) + 2);
  };
  useEffect(() => { refreshCaptcha(); }, []);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    subject: "Prise de rendez-vous",
    message: "",
    date: "",
    captcha: "",
  });

  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // validations
  const validate = useMemo(
    () => ({
      fullname: (v) => v.trim().length >= 2 || "Nom trop court.",
      email: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email invalide.",
      phone: (v) =>
        // tolérant : chiffres, espaces, +, -, ()
        /^[\d+()\s-]{7,20}$/.test(v) || "Téléphone invalide.",
      subject: (v) => v.trim().length > 0 || "Sujet requis.",
      message: (v) => v.trim().length >= 10 || "Message trop court (≥ 10 caractères).",
      captcha: (v) => Number(v) === a + b || "Captcha incorrect.",
    }),
    [a, b]
  );

  const runValidation = () => {
    const e = {};
    Object.entries(form).forEach(([k, v]) => {
      if (validate[k]) {
        const ok = validate[k](v);
        if (ok !== true) e[k] = ok;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setSent(false);

  // validations côté client
  if (!runValidation()) {
    setErrors((e) => ({ ...e, _global: "Veuillez corriger les champs en rouge." }));
    return;
  }

  // mapper fullname -> name pour l'API
  const payload = {
    name: form.fullname,            // <-- important
    email: form.email,
    phone: form.phone,
    subject: form.subject,
    message: form.message,
    date: form.date || null,        // envoyer null plutôt que "" si vide
  };

  try {
    setSending(true);
    const res = await fetch("http://127.0.0.1:8000/api/contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // essaye de lire les erreurs renvoyées par l'API
      let data = null;
      try { data = await res.json(); } catch (_) {}
      if (data && typeof data === "object") {
        setErrors((e) => ({ ...e, ...data, _global: "Impossible d’envoyer le formulaire." }));
      } else {
        setErrors((e) => ({ ...e, _global: "Erreur lors de l’envoi (code " + res.status + ")." }));
      }
      return;
    }

    // succès
    setSent(true);
    setForm({
      fullname: "",
      email: "",
      phone: "",
      subject: "Prise de rendez-vous",
      message: "",
      date: "",
      captcha: "",
    });
    refreshCaptcha(); // nouveau captcha
  } catch (err) {
    setErrors((e) => ({ ...e, _global: "Erreur réseau : " + (err?.message || "inconnue") }));
  } finally {
    setSending(false);
  }
};


  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Infos */}
            <div>
              <h1 className="text-3xl font-extrabold">Contact & Rendez-vous</h1>
              <p className="mt-2 text-gray-600">
                Laissez-nous vos coordonnées et votre message. On vous rappelle rapidement
                pour confirmer un créneau.
              </p>

              <div className="mt-6 rounded-2xl border p-5">
                <div className="text-sm text-gray-600">
                  <div className="font-semibold text-gray-900">Garage XYZ</div>
                  <div>Rue du Garage 12, 1000 Ville</div>
                  <div className="mt-2">Tél : 021 555 00 00</div>
                  <div>Email : contact@garage-xyz.ch</div>
                  <div className="mt-2 text-gray-500">
                    Lun–Ven 08:00–12:00 / 13:30–18:00, Sam 09:00–12:00
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              {sent && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  Merci ! Votre demande a bien été envoyée. Nous vous contacterons très vite.
                </div>
              )}
              {errors._global && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errors._global}
                </div>
              )}

              <form onSubmit={handleSubmit} className="rounded-2xl border p-5 space-y-4">
                <Field label="Nom complet *" error={errors.fullname}>
                  <input
                    name="fullname"
                    value={form.fullname}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 h-11"
                    placeholder="Jean Dupont"
                    required
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email *" error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      className="w-full border rounded-lg px-3 h-11"
                      placeholder="vous@email.com"
                      required
                    />
                  </Field>
                  <Field label="Téléphone *" error={errors.phone}>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      className="w-full border rounded-lg px-3 h-11"
                      placeholder="+41 79 000 00 00"
                      required
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Sujet *" error={errors.subject}>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={onChange}
                      className="w-full border rounded-lg px-3 h-11"
                      required
                    >
                      <option>Prise de rendez-vous</option>
                      <option>Devis entretien</option>
                      <option>Question technique</option>
                      <option>Autre</option>
                    </select>
                  </Field>

                  <Field label="Date souhaitée (optionnel)">
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={onChange}
                      className="w-full border rounded-lg px-3 h-11"
                    />
                  </Field>
                </div>

                <Field label="Message *" error={errors.message}>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Décrivez votre besoin (p. ex. révision complète, bruit, voyant moteur...)"
                    required
                  />
                </Field>

                {/* Captcha */}
                <Field label={`Êtes-vous un humain ? Combien font ${a} + ${b} ?`} error={errors.captcha}>
                  <div className="flex gap-2">
                    <input
                      name="captcha"
                      value={form.captcha}
                      onChange={onChange}
                      className="w-40 border rounded-lg px-3 h-11"
                      placeholder="Réponse"
                    />
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="rounded-lg border px-3 h-11 text-sm hover:bg-gray-50"
                      title="Nouveau captcha"
                    >
                      ↻
                    </button>
                  </div>
                </Field>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-lg bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white px-5 h-11 text-sm font-semibold"
                  >
                    {sending ? "Envoi..." : "Envoyer la demande"}
                  </button>
                  <span className="text-xs text-gray-500">* champs obligatoires</span>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      {children}
    </label>
  );
}
