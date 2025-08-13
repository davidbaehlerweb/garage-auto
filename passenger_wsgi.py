import os, sys
project_path = os.path.dirname(os.path.abspath(__file__))
if project_path not in sys.path:
    sys.path.insert(0, project_path)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cars.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
