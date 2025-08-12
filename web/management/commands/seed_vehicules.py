from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from decimal import Decimal
from faker import Faker
import random, io, pathlib

from web.models import Vehicule

# Quelques jeux de valeurs réalistes
MAKES_MODELS = {
    "BMW": ["M3", "M4", "X5", "i3", "320d"],
    "Audi": ["A3", "A4", "A6", "Q5", "TT"],
    "Mercedes": ["C220", "E200", "GLA", "CLA", "C63"],
    "Volkswagen": ["Golf", "Passat", "Tiguan", "Polo"],
    "Porsche": ["911", "Cayman", "Macan", "Panamera"],
    "Lamborghini": ["Huracan", "Aventador"],
    "Ferrari": ["488", "F430", "Roma"],
}
FUELS = ["Essence", "Diesel", "Hybride", "Électrique"]
TRANSMISSIONS = ["Manuelle", "Auto"]

# Quelques images locales optionnelles (mets-en 5–10 dans media/vehicules)
LOCAL_IMG_DIR = pathlib.Path("media/vehicules")

fake = Faker("fr_CH")

class Command(BaseCommand):
    help = "Génère des véhicules factices"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=50, help="Nombre de véhicules à créer")
        parser.add_argument("--with-images", action="store_true", help="Attacher aussi une image")

    def handle(self, *args, **opts):
        count = opts["count"]
        with_images = opts["with_images"]

        # liste d’images dispo
        local_images = []
        if with_images and LOCAL_IMG_DIR.exists():
            for p in LOCAL_IMG_DIR.iterdir():
                if p.suffix.lower() in {".jpg", ".jpeg", ".png"}:  # (tu peux ajouter .webp si Pillow est OK)
                    local_images.append(p)

        created = 0
        for _ in range(count):
            make = random.choice(list(MAKES_MODELS.keys()))
            model = random.choice(MAKES_MODELS[make])

            price = Decimal(random.randrange(5000, 180000))  # 5k – 180k
            year = random.randrange(2000, 2025)
            mileage = random.randrange(0, 220_000, 500)
            fuel = random.choice(FUELS)
            transmission = random.choice(TRANSMISSIONS)
            is_available = random.random() > 0.25

            v = Vehicule.objects.create(
                make=make,
                model=model,
                year=year,
                price=price,
                mileage_km=mileage,
                fuel=fuel,
                transmission=transmission,
                description=fake.paragraph(nb_sentences=3),
                is_available=is_available,
            )

            # Attacher une image locale aléatoire (si demandé)
            if with_images and local_images:
                img_path = random.choice(local_images)
                with open(img_path, "rb") as f:
                    # nom unique pour éviter collisions
                    fname = f"{img_path.stem}-{get_random_string(6)}{img_path.suffix.lower()}"
                    v.image.save(fname, ContentFile(f.read()), save=True)

            created += 1

        self.stdout.write(self.style.SUCCESS(f"{created} véhicules générés."))
