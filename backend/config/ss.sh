#!/bin/bash

set -e

cd /app
echo "Making Django migrations..."
python manage.py makemigrations
python manage.py migrate

# echo "Collecting static files..."
# python manage.py collectstatic --noinput

# echo "creating superuser..."
# python manage.py createsuperuser --no-input || echo "superuser already exists"

echo "Starting Django development server..."
python manage.py runserver 0.0.0.0:8000