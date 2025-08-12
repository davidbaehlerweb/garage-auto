from rest_framework import serializers
from .models import Vehicule, ContactRequest

class VehiculeSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Vehicule
        fields = [
            "id","make","model","year","price","mileage_km",
            "fuel","transmission","description","is_available",
            "image","image_url","created_at"
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url

class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = "__all__"
        read_only_fields = ("id", "created_at",)