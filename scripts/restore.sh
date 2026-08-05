#!/usr/bin/env bash
set -Eeuo pipefail

if [[ $# -ne 1 || ! -f "$1" ]]; then
  echo "Usage: $0 /absolute/path/to/db-backup.dump" >&2
  exit 2
fi
cd /opt/tso-bookclub
set -a
source ./.env
set +a
docker compose exec -T db pg_restore --clean --if-exists --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$1"
