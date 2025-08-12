export default function Services() {
  const items = [
    {
      title: "Entretien & Vidange",
      text: "Révision constructeur, filtres, freins, pneus.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M3 6h18M6 6v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V6"
                stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      ),
    },
    {
      title: "Diagnostic électronique",
      text: "Lecture défauts, recalibrage, mises à jour.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M4 7h16M8 7v10m8-10v10M4 17h16" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      ),
    },
    {
      title: "Carrosserie & Pare-brise",
      text: "Réparation, peinture, remplacement rapide.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M3 13l3-4h12l3 4v5H3z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="7.5" cy="18" r="1.5" />
          <circle cx="16.5" cy="18" r="1.5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Nos services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow transition">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-yellow-100 text-yellow-700">
                {it.icon}
              </div>
              <h3 className="font-semibold text-lg">{it.title}</h3>
            </div>
            <p className="text-gray-600 mt-3">{it.text}</p>
            <a href="#" className="text-sm mt-4 inline-block text-yellow-600 hover:text-yellow-700">
              En savoir plus →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
