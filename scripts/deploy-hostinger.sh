#!/usr/bin/env bash
set -euo pipefail

# deploy-hostinger.sh
# Automated script to prepare an Ubuntu 22.04 server (Hostinger VPS) and deploy a Next.js app
# - Installs system dependencies (git, node, pm2, nginx, certbot, postgresql)
# - Creates PostgreSQL database and user
# - Clones or pulls the project repo and installs & builds
# - Starts the application with pm2 and configures pm2 startup
# - Creates an Nginx site file and obtains a Let's Encrypt certificate (certbot --nginx)

# Usage example (run on your VPS as a user with sudo):
# sudo bash deploy-hostinger.sh \
#   --repo "git@github.com:Mustafaelfangary/Altavidatours.git" \
#   --branch "main" \
#   --domain "altavidatours.example.com" \
#   --email "admin@example.com" \
#   --app-port 3003 \
#   --app-dir "/var/www/altavidatours" \
#   --pm2-name "altavidatours" \
#   --db-name "altavidatours_db" \
#   --db-user "altavidatours_user" \
#   --db-pass "1082-034ASas"

print_usage(){
  cat <<EOF
deploy-hostinger.sh — deploy and configure Altavidatours on Ubuntu 22.04 (Hostinger VPS)

Usage:
  sudo bash deploy-hostinger.sh --repo REPO_URL --branch BRANCH --domain DOMAIN --email ADMIN_EMAIL \
    --app-port PORT --app-dir APP_DIR --pm2-name PM2_NAME --db-name DBNAME --db-user DBUSER --db-pass DBPASS

Required flags:
  --repo     Git repository URL
  --branch   Branch to deploy (default: main)
  --domain   Domain name to configure (Nginx server_name)
  --email    Admin email used by certbot
  --app-port Port application will listen on (eg 3003)
  --app-dir  Full path where the app will be cloned (eg /var/www/altavidatours)
  --pm2-name Name for pm2 process (eg altavidatours)
  --db-name  PostgreSQL database name
  --db-user  PostgreSQL username
  --db-pass  PostgreSQL password

Notes:
 - The script is idempotent for common actions (it will pull if the repo folder exists).
 - It assumes Ubuntu 22.04 and that you run with sudo or root.
 - The script will set up certbot (snap-based) and attempt to obtain a certificate for --domain.
 - If other services already use the chosen --app-port, pick another port and update Nginx accordingly.

EOF
}

if [ "$#" -eq 0 ]; then
  print_usage
  exit 0
fi

### Parse arguments
REPO=""
BRANCH="main"
DOMAIN=""
EMAIL=""
APP_PORT="3003"
APP_DIR="/var/www/altavidatours"
PM2_NAME="altavidatours"
DB_NAME="altavidatours_db"
DB_USER="altavidatours_user"
DB_PASS="1082-034ASas"

while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --repo) REPO="$2"; shift; shift;;
    --branch) BRANCH="$2"; shift; shift;;
    --domain) DOMAIN="$2"; shift; shift;;
    --email) EMAIL="$2"; shift; shift;;
    --app-port) APP_PORT="$2"; shift; shift;;
    --app-dir) APP_DIR="$2"; shift; shift;;
    --pm2-name) PM2_NAME="$2"; shift; shift;;
    --db-name) DB_NAME="$2"; shift; shift;;
    --db-user) DB_USER="$2"; shift; shift;;
    --db-pass) DB_PASS="$2"; shift; shift;;
    -h|--help) print_usage; exit 0;;
    *) echo "Unknown argument: $1"; print_usage; exit 1;;
  esac
done

if [ -z "$REPO" ] || [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "--repo, --domain and --email are required."
  print_usage
  exit 2
fi

echo "Starting deployment for $REPO (branch: $BRANCH) -> $APP_DIR, domain: $DOMAIN, port: $APP_PORT"

if [ "$EUID" -ne 0 ]; then
  echo "This script must be run as root or with sudo. Re-run with sudo.";
  exit 3
fi

set -x

apt-get update
apt-get upgrade -y

# Install common dependencies
apt-get install -y git curl build-essential ca-certificates nginx postgresql postgresql-contrib

# Node.js (20.x LTS) via NodeSource
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# Install pm2 globally
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

# Install certbot (snap) if not present
if ! command -v certbot >/dev/null 2>&1; then
  apt-get install -y snapd
  snap install core; snap refresh core
  snap install --classic certbot
  ln -sf /snap/bin/certbot /usr/bin/certbot
fi

# Configure PostgreSQL user & database
echo "Configuring PostgreSQL..."
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}';" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE \"${DB_NAME}\";"
sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}';" | grep -q 1 || sudo -u postgres psql -c "CREATE USER \"${DB_USER}\" WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"${DB_NAME}\" TO \"${DB_USER}\";"

# Ensure APP_DIR exists and is owned by the current sudo user
if [ ! -d "$APP_DIR" ]; then
  mkdir -p "$APP_DIR"
  chown "$SUDO_USER":"$SUDO_USER" "$APP_DIR" || true
fi

echo "Cloning or updating repo into $APP_DIR..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  # clone fresh
  rm -rf "$APP_DIR"
  git clone --depth=1 --branch "$BRANCH" "$REPO" "$APP_DIR"
  chown -R "$SUDO_USER":"$SUDO_USER" "$APP_DIR" || true
  cd "$APP_DIR"
fi

# Install and build
echo "Installing dependencies and building app (this can take time)..."
npm ci --prefer-offline --no-audit --progress=false || npm install
npm run build || true

# Start app with PM2
echo "Starting application with pm2 (name: $PM2_NAME, port: $APP_PORT)"
# Use environment variable PORT to override default Next.js port if supported by app
pm2 start --name "$PM2_NAME" npm -- start -- -p "$APP_PORT"
pm2 save
pm2 startup systemd -u $SUDO_USER --hp "/home/$SUDO_USER" || true

### Create Nginx site
NGINX_CONF="/etc/nginx/sites-available/$PM2_NAME"
echo "Creating nginx site file: $NGINX_CONF"
cat > "$NGINX_CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    # Increase proxy buffer sizes for Next.js
    client_max_body_size 100M;

    location /_next/static/ {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_cache_valid 200 1d;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering on;
    }

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/$PM2_NAME

echo "Testing nginx configuration and reloading..."
nginx -t && systemctl restart nginx

echo "Allowing nginx through ufw if ufw present..."
if command -v ufw >/dev/null 2>&1; then
  ufw allow 'Nginx Full' || true
fi

### Obtain SSL certificate via certbot --nginx
echo "Requesting Let's Encrypt certificate for $DOMAIN (certbot --nginx)"
certbot --nginx -n --agree-tos --email "$EMAIL" -d "$DOMAIN" || {
  echo "certbot failed automatically, please run: sudo certbot --nginx -d $DOMAIN";
}

echo "Deployment finished."
echo " - App directory: $APP_DIR"
echo " - PM2 process name: $PM2_NAME (port $APP_PORT)"
echo " - PostgreSQL DB: $DB_NAME user: $DB_USER"
echo "Run 'pm2 status' to verify process and 'journalctl -u nginx' if there were Nginx issues."

exit 0
