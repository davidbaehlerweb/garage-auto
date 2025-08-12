export default function CarCard({ car }) {
  const raw = car?.image_url || car?.image || "";
  const imageSrc = raw ? (raw.startsWith("http") ? raw : `http://127.0.0.1:8000${raw}`) : null;

  return (
    <div className="group rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${car.make} ${car.model}`}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
                     <rect width='100%' height='100%' fill='#f3f4f6'/>
                     <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
                           fill='#9ca3af' font-family='system-ui, sans-serif' font-size='18'>
                       Aperçu
                     </text>
                   </svg>`
                );
            }}
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400 text-sm">Aperçu</div>
        )}

        {!car.is_available && (
          <span className="absolute left-3 top-3 rounded-md bg-gray-900/85 text-white text-xs px-2 py-1">
            Indisponible
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg">
            {car.make} {car.model} <span className="text-gray-500">• {car.year}</span>
          </h3>
          <div className="font-bold text-yellow-600 whitespace-nowrap">
            {Number(car.price).toLocaleString()} CHF
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-2">
          <span>{Number(car.mileage_km || 0).toLocaleString()} km</span>
          <span>{car.fuel}</span>
          <span>{car.transmission}</span>
        </div>

        <a
          href="#"
          className="mt-4 inline-flex items-center justify-center rounded-lg border px-4 h-10 text-sm font-medium hover:bg-gray-50 transition"
        >
          Détails
        </a>
      </div>
    </div>
  );
}
