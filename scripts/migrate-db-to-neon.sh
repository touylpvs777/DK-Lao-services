#!/usr/bin/env bash
# Copy the local Docker CRM database (container dk-db) into a hosted Postgres such as Neon.
#   NEON_DATABASE_URL='postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require' bash scripts/migrate-db-to-neon.sh
# The target should be empty: existing tables with the same names are dropped and replaced.
set -euo pipefail

: "${NEON_DATABASE_URL:?Set NEON_DATABASE_URL to the Neon connection string}"
DB_USER="${DB_USER:-dk_user}"
DB_NAME="${DB_NAME:-dk_crm}"
DUMP="$(mktemp -t dk_crm.XXXXXX.dump)"
trap 'rm -f "$DUMP"' EXIT

echo "Dumping $DB_NAME from dk-db..."
docker exec dk-db pg_dump -U "$DB_USER" -d "$DB_NAME" --format=custom --no-owner --no-privileges > "$DUMP"
echo "Dump size: $(wc -c < "$DUMP") bytes"

echo "Restoring into the hosted database..."
# pg_restore from the same Postgres image as dk-db; the dump goes in on stdin.
docker run --rm -i postgres:16-alpine \
  pg_restore --no-owner --no-privileges --clean --if-exists --exit-on-error -d "$NEON_DATABASE_URL" < "$DUMP"

echo "Row counts in the hosted database:"
docker run --rm postgres:16-alpine psql "$NEON_DATABASE_URL" -Atc \
  "select 'users', count(*) from users union all select 'customers', count(*) from customers union all select 'leads', count(*) from leads"
