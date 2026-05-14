import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bank_project.settings')
application = get_wsgi_application()

# Biz qo'shgan kod:
from django.core.management import call_command
try:
    call_command('migrate')
except Exception as e:
    pass
