export default function CTA() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-gray-900 text-white px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Besoin d’un entretien ou d’un diagnostic ?</h3>
            <p className="text-gray-300 mt-1">Prenez rendez-vous en quelques clics, on s’occupe du reste.</p>
          </div>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-xl px-5 h-11 font-semibold bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition"
          >
            Prendre RDV
          </a>
        </div>
      </div>
    </section>
  );
}
