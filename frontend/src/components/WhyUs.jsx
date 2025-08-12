export default function WhyUs() {
  const points = [
    { title: "Intervention rapide", text: "Créneaux sous 24/48h selon disponibilité." },
    { title: "Garantie pièces & main d’œuvre", text: "Garantie jusqu’à 24 mois." },
    { title: "Devis clair", text: "Aucun frais caché, validation avant travaux." },
    { title: "Véhicule de courtoisie", text: "Sur demande et selon disponibilité." },
  ];

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Pourquoi nous choisir ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border bg-white p-6">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-block h-5 w-5 rounded-full bg-yellow-500"></span>
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{p.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
