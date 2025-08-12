# cars/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

from web.views import VehiculeViewSet, AdminLoginView, contact_form, ContactRequestViewSet  # <-- import ici

router = DefaultRouter()
router.register(r"vehicules", VehiculeViewSet, basename="vehicule")
router.register(r"contacts", ContactRequestViewSet, basename="contact")  # 👈 AJOUT
urlpatterns = [
    path("admin/", admin.site.urls),

    # API
    path("api/", include(router.urls)),
    path("api/admin/login/", AdminLoginView.as_view()),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/contact/", contact_form, name="contact_form"),  # <-- endpoint contact
]

# Servir MEDIA/STATIC en dev (avant le catch-all)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # (optionnel) seulement si tu as un STATIC_ROOT et que tu veux le servir en dev :
    # urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Catch-all SPA à la toute fin
urlpatterns += [
    re_path(r"^(?!media/|static/).*$", TemplateView.as_view(template_name="index.html")),
]
