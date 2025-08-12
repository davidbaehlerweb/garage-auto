from django.db import models


class Vehicule(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=80)
    year = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mileage_km = models.PositiveIntegerField(default=0)
    fuel = models.CharField(max_length=30, default="Essence")
    transmission = models.CharField(max_length=30, default="Manuelle")
    image = models.ImageField(upload_to="vehicules/", blank=True, null=True)
    description = models.TextField(blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.make} {self.model} {self.year}"

class ContactRequest(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Demande de {self.name} ({self.email})"