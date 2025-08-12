import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Services() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Nos services
            </h1>
            <p className="mt-3 text-gray-600">
              Entretien, diagnostic, carrosserie et préparation : tout pour prendre soin
              de votre véhicule, avec des techniciens qualifiés et du matériel certifié.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/contact"
                className="inline-flex h-11 items-center rounded-lg bg-yellow-500 px-5 font-medium text-white hover:bg-yellow-600"
              >
                Demander un rendez-vous
              </Link>
              <a
                href="#tarifs"
                className="inline-flex h-11 items-center rounded-lg border px-5 font-medium hover:bg-gray-50"
              >
                Voir les tarifs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cartes de services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ServiceCard
            icon="🛠️"
            title="Entretien & Révision"
            desc="Vidange, filtres, plaquettes, courroies… Forfaits constructeurs respectés."
            features={["Vidange & filtres", "Freinage", "Contrôles 50+ points"]}
          />
          <ServiceCard
            icon="🧪"
            title="Diagnostic"
            desc="Lecture valise, pannes électroniques, témoins moteur, ABS, airbag."
            features={["Valise multimarques", "Électrique/électronique", "Essai routier"]}
          />
          <ServiceCard
            icon="🧽"
            title="Carrosserie & Esthétique"
            desc="Débosselage, retouches peinture, lustrage, rénovation optiques."
            features={["Débosselage", "Peinture spot", "Polissage/lustrage"]}
          />
          <ServiceCard
            icon="🔧"
            title="Mécanique"
            desc="Embrayage, suspensions, échappement, distribution."
            features={["Distribution", "Embrayage", "Amortisseurs"]}
          />
          <ServiceCard
            icon="🔋"
            title="Batterie & Démarrage"
            desc="Test batterie/alternateur, remplacement, câblage."
            features={["Test démarreur", "Remplacement batterie", "Alternateur"]}
          />
          <ServiceCard
            icon="🧊"
            title="Climatisation"
            desc="Recharge, détection fuite, traitement antibactérien."
            features={["Recharge gaz", "Traçage UV", "Nettoyage circuit"]}
          />
        </div>
      </section>

      {/* Process */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold">Comment ça se passe ?</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Step n="1" title="Prise de RDV" text="Par téléphone ou en ligne, à la date qui vous convient." />
            <Step n="2" title="Diagnostic" text="Contrôle rapide & devis clair avant toute intervention." />
            <Step n="3" title="Intervention" text="Réparation/entretien puis restitution avec explications." />
          </div>
        </div>
      </section>

      {/* Tarifs / CTA */}
      <section id="tarifs" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <PriceCard
            title="Entretien Standard"
            price="dès 149 CHF"
            items={["Vidange + filtre huile", "Contrôles visuels", "Remise à zéro échéance"]}
          />
          <PriceCard
            popular
            title="Révision Constructeur"
            price="dès 299 CHF"
            items={["Filtres (air/habitacle/huile)*", "Contrôles 50+ points", "Carnet d’entretien respecté"]}
            note="* selon modèle"
          />
          <PriceCard
            title="Diagnostic Complet"
            price="89 CHF"
            items={["Lecture valise", "Essai routier", "Rapport et devis précis"]}
          />
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/contact"
            className="inline-flex h-11 items-center rounded-lg bg-yellow-500 px-6 font-semibold text-white hover:bg-yellow-600"
          >
            Obtenir un devis gratuit
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            Les tarifs peuvent varier selon le modèle et l’état du véhicule.
          </p>
        </div>
      </section>

      {/* FAQ courte */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold">Questions fréquentes</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Faq q="Puis-je attendre sur place ?" a="Oui, nous avons un espace d’attente avec Wi-Fi et boissons." />
            <Faq q="Gardez-vous la garantie constructeur ?" a="Oui, nous respectons les préconisations constructeur et pièces de qualité." />
            <Faq q="Faites-vous un devis avant ?" a="Toujours. Aucun travail n’est lancé sans votre accord." />
            <Faq q="Proposez-vous un véhicule de courtoisie ?" a="Sur demande et selon disponibilité. Parlez-en lors de la prise de RDV." />
          </div>
        </div>
      </section>

      {/* Bandeau contact */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-white">
          <h3 className="text-xl font-semibold">Besoin d’un conseil ?</h3>
          <p className="mt-1 text-gray-300">
            Expliquez-nous votre besoin, on vous guide vers la bonne prestation.
          </p>
          <div className="mt-5">
            <Link
              to="/contact"
              className="inline-flex h-11 items-center rounded-lg bg-yellow-500 px-6 font-semibold text-gray-900 hover:bg-yellow-400"
            >
              Contacter l’atelier
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* --- petits composants --- */
function ServiceCard({ icon, title, desc, features = [] }) {
  return (
    <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-lg">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
      {features?.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-gray-700 list-disc list-inside">
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="h-8 w-8 rounded-full bg-yellow-500 text-white grid place-items-center font-bold">
        {n}
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <p className="text-sm text-gray-600 mt-1">{text}</p>
    </div>
  );
}

function PriceCard({ title, price, items = [], popular = false, note }) {
  return (
    <div className={`rounded-2xl border bg-white p-6 ${popular ? "ring-2 ring-yellow-500" : ""}`}>
      {popular && (
        <div className="mb-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
          Populaire
        </div>
      )}
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-2xl font-extrabold text-yellow-600">{price}</div>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1">✔️</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/contact"
        className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg border font-medium hover:bg-gray-50"
      >
        Demander un devis
      </Link>
      {note && <p className="mt-2 text-xs text-gray-500">{note}</p>}
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <details className="rounded-2xl border bg-white p-5">
      <summary className="cursor-pointer list-none font-medium">
        {q}
      </summary>
      <p className="mt-2 text-sm text-gray-600">{a}</p>
    </details>
  );
}
