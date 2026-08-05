#!/usr/bin/env bash
set -Eeuo pipefail

cd /opt/tso-bookclub
git fetch origin main
git checkout main
git reset --hard origin/main
docker compose config --quiet
docker compose build --pull
docker compose up -d db
docker compose run --rm backend python manage.py migrate --noinput
docker compose run --rm backend python manage.py collectstatic --noinput
docker compose up -d --remove-orphans
docker compose ps
curl --fail --retry 12 --retry-delay 5 https://tso.bookclub.csir.co.za/health/
