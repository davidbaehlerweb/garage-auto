from pathlib import Path
from datetime import timedelta
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# --- Sécurité / env ---
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-only-secret-key")
DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

# Domaines autorisés
ALLOWED_HOSTS = os.environ.get(
    "DJANGO_ALLOWED_HOSTS",
    "api.garage-auto.shop,garage-auto.shop,www.garage-auto.shop,localhost,127.0.0.1"
).split(",")

# ========= Apps =========
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # API / Auth
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",

    # App
    "web",
]

# ========= Middleware (ordre important) =========
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",   # Static en prod
    "corsheaders.middleware.CorsMiddleware",        # CORS avant CommonMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "cars.urls"

# ========= Templates =========
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "frontend" / "dist"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "cars.wsgi.application"

# ========= DB =========
# En prod sur Hostinger, définis DATABASE_URL dans les variables d'env
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        ssl_require=False,
    )
}

# ========= Passwords =========
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ========= i18n =========
LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Europe/Zurich"
USE_I18N = True
USE_TZ = True

# ========= Static / React build =========
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

_front_dist = BASE_DIR / "frontend" / "dist"
if _front_dist.exists():
    STATICFILES_DIRS = [_front_dist]

if not DEBUG:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ========= Media =========
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ========= DRF / JWT =========
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
    "DEFAULT_PARSER_CLASSES": (
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=4),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

# ========= CORS / CSRF =========
_default_cors = (
    "http://localhost:5173,"
    "http://127.0.0.1:5173,"
    "https://garage-auto.shop,"
    "https://www.garage-auto.shop"
)
CORS_ALLOWED_ORIGINS = os.environ.get("DJANGO_CORS_ALLOWED_ORIGINS", _default_cors).split(",")

_default_csrf = (
    "http://localhost:5173,"
    "http://127.0.0.1:5173,"
    "https://garage-auto.shop,"
    "https://www.garage-auto.shop,"
    "https://api.garage-auto.shop"
)
CSRF_TRUSTED_ORIGINS = os.environ.get("DJANGO_CSRF_TRUSTED_ORIGINS", _default_csrf).split(",")

CORS_ALLOW_CREDENTIALS = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ========= Email =========
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "david.baehler.pro@gmail.com")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "qxfo vwyv ppqr gpxf")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# Si Hostinger/Apache est derrière un proxy HTTPS :
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ========= Sécurité Prod =========
if not DEBUG:
    SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "True") == "True"
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = int(os.environ.get("SECURE_HSTS_SECONDS", "0"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = False
    SECURE_HSTS_PRELOAD = False
