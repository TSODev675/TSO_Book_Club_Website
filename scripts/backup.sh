#!/usr/bin/env bash
set -Eeuo pipefail

cd /opt/tso-bookclub
backup_dir=/opt/tso-bookclub/backups
mkdir -p "$backup_dir"
set -a
source ./.env
set +a
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
umask 077
docker compose exec -T db pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$backup_dir/db-$timestamp.dump"
find "$backup_dir" -type f -name 'db-*.dump' -mtime +14 -delete
