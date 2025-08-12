from django.contrib import admin
from .models import Vehicule, ContactRequest

@admin.register(Vehicule)
class VehiculeAdmin(admin.ModelAdmin):
    list_display = ("make","model","year","price","is_available","created_at")
    list_filter = ("make","is_available","fuel","transmission","year")
    search_fields = ("make","model")

@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "created_at")
    search_fields = ("name", "email", "phone", "message")
    list_filter = ("created_at",)