from django.contrib.auth import authenticate, get_user_model

from rest_framework import serializers, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly, SAFE_METHODS
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactRequest

from .models import Vehicule
from .serializers import VehiculeSerializer, ContactRequestSerializer


# -------- Auth: email OU username --------
class EmailOrUsernameAuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField(label="Username or Email")
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        login = attrs.get('username')
        password = attrs.get('password')
        request = self.context.get('request')
        User = get_user_model()

        # si email, on retrouve le username
        if login and '@' in login:
            try:
                user_obj = User.objects.get(email__iexact=login)
                login = getattr(user_obj, User.USERNAME_FIELD)  # souvent 'username'
            except User.DoesNotExist:
                pass

        user = authenticate(request=request, username=login, password=password)
        if not user:
            raise serializers.ValidationError('Identifiants invalides', code='authorization')
        attrs['user'] = user
        return attrs


class AdminLoginView(ObtainAuthToken):
    serializer_class = EmailOrUsernameAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.get_username()})


# -------- API Véhicules --------
class VehiculeViewSet(ModelViewSet):
    queryset = Vehicule.objects.all()
    serializer_class = VehiculeSerializer
    parser_classes = [MultiPartParser, FormParser]  # important pour l'upload

    def get_permissions(self):
        # lecture publique, écriture réservée (token/JWT)
        if self.request.method in SAFE_METHODS:
            return []
        return [IsAuthenticatedOrReadOnly()]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    # create avec logs de diagnostic
    def create(self, request, *args, **kwargs):
        print(">> request.data keys:", list(request.data.keys()))
        print(">> request.FILES keys:", list(request.FILES.keys()))
        if "image" in request.FILES:
            f = request.FILES["image"]
            print(">> image name:", getattr(f, "name", None), "size:", getattr(f, "size", None))

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

@api_view(["POST"])
def contact_form(request):
    name = request.data.get("name")
    email = request.data.get("email")
    phone = request.data.get("phone")
    message = request.data.get("message")

    if not all([name, email, phone, message]):
        return Response({"error": "Tous les champs sont requis"}, status=400)

    # 1. Sauvegarder en base
    contact = ContactRequest.objects.create(
        name=name,
        email=email,
        phone=phone,
        message=message
    )

    # 2. Envoyer un mail à l’admin
    send_mail(
        subject=f"Nouvelle demande de contact de {name}",
        message=f"""
Nom: {name}
Email: {email}
Téléphone: {phone}

Message:
{message}
""",
        from_email=settings.DEFAULT_FROM_EMAIL,     
        recipient_list=[settings.EMAIL_HOST_USER],  
        fail_silently=False,
    )

    return Response({"success": True, "message": "Demande envoyée avec succès"})


class ContactRequestViewSet(ModelViewSet):
    queryset = ContactRequest.objects.all().order_by("-created_at")
    serializer_class = ContactRequestSerializer

    # lecture publique (si tu préfères), écriture/suppression pour admin connecté
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return []
        return [IsAuthenticatedOrReadOnly()]