import { useState, useMemo } from "react";
import CarCard from "./CarCards";

export default function VehiculeList({ cars = [] }) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("Toutes marques");
  const [fuel, setFuel] = useState("Carburant");
  const [sort, setSort] = useState("recent"); // "recent", "priceAsc", "priceDesc"

  // Liste filtrée et triée
  const filteredCars = useMemo(() => {
    let list = [...cars];

    // 🔍 Filtre recherche (make + model)
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.make.toLowerCase().includes(s) ||
          c.model.toLowerCase().includes(s)
      );
    }

    // 🚗 Filtre marque
    if (brand !== "Toutes marques") {
      list = list.filter((c) => c.make === brand);
    }

    // ⛽ Filtre carburant
    if (fuel !== "Carburant") {
      list = list.filter((c) => c.fuel === fuel);
    }

    // ↕️ Tri
    if (sort === "priceAsc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "priceDesc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "recent") {
      list.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }

    return list;
  }, [cars, search, brand, fuel, sort]);

  if (!cars.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-gray-600">Aucun véhicule disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Tous nos véhicules</h2>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          className="border rounded-lg px-3 h-10"
          placeholder="Recherche…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-lg px-3 h-10"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option>Toutes marques</option>
          <option>BMW</option>
          <option>Audi</option>
          <option>Mercedes</option>
          <option>Volkswagen</option>
          <option>Porsche</option>
        </select>
        <select
          className="border rounded-lg px-3 h-10"
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
        >
          <option>Carburant</option>
          <option>Essence</option>
          <option>Diesel</option>
          <option>Hybride</option>
          <option>Électrique</option>
        </select>
        <select
          className="border rounded-lg px-3 h-10"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="recent">Plus récents</option>
          <option value="priceAsc">Prix croissant</option>
          <option value="priceDesc">Prix décroissant</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.length ? (
          filteredCars.map((car) => <CarCard key={car.id} car={car} />)
        ) : (
          <p className="text-gray-500">Aucun véhicule trouvé.</p>
        )}
      </div>
    </section>
  );
}
