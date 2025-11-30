#!/usr/bin/env bash
set -euo pipefail

# ========= CONFIG =========
DB_NAME="altavida"
DB_USER="altavida_user"
DB_PASSWORD="1082034ASas"   # WARNING: do NOT commit this script with real password in public repos
# App directory where .env resides (adjust if different)
APP_DIR="/var/www/altavidatours"
# Set to 1 to append DATABASE_URL into $APP_DIR/.env automatically
WRITE_ENV=0
# ========= END CONFIG =========

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root or with sudo." >&2
  exit 1
fi

 echo "==> Installing PostgreSQL (if not installed)"
apt update -y
apt install -y postgresql postgresql-contrib

 echo "==> Starting and enabling PostgreSQL"
systemctl enable postgresql
systemctl start postgresql

 echo "==> Creating database user and database"
su - postgres -c "psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}'\"" | grep -q 1 || su - postgres -c "psql -c \"CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';\""
su - postgres -c "psql -tAc \"SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'\"" | grep -q 1 || su - postgres -c "createdb -O ${DB_USER} ${DB_NAME}"

 echo "==> Ensuring local auth allows password (md5)"
PG_HBA="/etc/postgresql/$(ls /etc/postgresql | sort -nr | head -n1)/main/pg_hba.conf"
sed -i 's/^local\s\+all\s\+postgres\s\+peer/local all postgres peer/' "$PG_HBA"
# Ensure an md5 line exists for all users
if ! grep -q "^local\s\+all\s\+all\s\+md5" "$PG_HBA"; then
  echo "local   all             all                                     md5" >> "$PG_HBA"
fi

 echo "==> Restricting to localhost (no remote access by default)"
PG_CONF="/etc/postgresql/$(ls /etc/postgresql | sort -nr | head -n1)/main/postgresql.conf"
sed -i "s/^#\?listen_addresses.*/listen_addresses = 'localhost'/" "$PG_CONF"

systemctl restart postgresql

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
echo "==> DATABASE_URL: $DATABASE_URL"

if [ "$WRITE_ENV" -eq 1 ]; then
  echo "==> Writing DATABASE_URL into $APP_DIR/.env"
  mkdir -p "$APP_DIR"
  touch "$APP_DIR/.env"
  if grep -q '^DATABASE_URL=' "$APP_DIR/.env"; then
    sed -i "s|^DATABASE_URL=.*$|DATABASE_URL=${DATABASE_URL//|/\|}|" "$APP_DIR/.env"
  else
    echo "DATABASE_URL=$DATABASE_URL" >> "$APP_DIR/.env"
  fi
  chmod 600 "$APP_DIR/.env"
fi

 echo "==> Done. Test connection with:"
 echo "    su - postgres -c \"psql -c '\''\conninfo'\''\""
 echo "    psql \"$DATABASE_URL\" -c 'SELECT 1;'  # if psql client configured"
