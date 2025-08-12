import { useEffect, useState } from "react";
import Header from "../components/Header";
import VehiculeList from "../components/VehiculeList";

export default function Vehicles() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/vehicules/")
      .then((r) => r.json())
      .then((data) => {
        // si jamais l'API renvoie un objet paginé, on prend .results
        const arr = Array.isArray(data) ? data : (data?.results || []);
        setCars(arr);
      })
      .catch(() => setCars([]));
  }, []);

  return (
    <>
      <Header />
      <main className="bg-white">
        <VehiculeList cars={cars} />
      </main>
    </>
  );
}
