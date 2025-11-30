#!/usr/bin/env bash
#
# deploy_altavidatours.sh
#
# One-stop automation for:
#  - Server setup on Ubuntu 22.04 LTS (Node.js, PM2, Nginx, UFW)
#  - Next.js deployment (build, PM2 process)
#  - Nginx reverse proxy config for altavidatours.com
#  - SSL via Let's Encrypt (certbot)
#  - PostgreSQL database/user creation (subcommand)
#
# Usage examples (run on the VPS):
#   sudo bash deploy_altavidatours.sh deploy \
#       --domain altavidatours.com \
#       --email admin@altavidatours.com \
#       --repo https://github.com/YourOrg/Altavidatours.git \
#       --branch main \
#       --env_source /root/altavidatours.env
#
#   sudo bash deploy_altavidatours.sh createdb \
#       --dbname altavidatoursdb \
#       --dbuser altavidatours \
#       --dbpass 'StrongPasswordHere'
#
# Notes:
#  - Run as root (sudo). The script is idempotent where reasonable.
#  - For deploy, you can either clone the repo or copy the project to APP_DIR beforehand.
#  - Provide an .env file via --env_source, otherwise a template will be created.
#
set -euo pipefail

# Defaults (can be overridden by flags)
DOMAIN="altavidatours.com"
ADMIN_EMAIL="admin@${DOMAIN}"
APP_USER="altavida"
APP_DIR="/var/www/altavidatours"
REPO_URL=""
REPO_BRANCH="main"
ENV_SOURCE=""
NODE_MAJOR="20"  # LTS line
APP_PORT="3005"
PM2_APP_NAME="altavidatours-web"
NGINX_SITE_PATH="/etc/nginx/sites-available/${DOMAIN}"
NGINX_SITE_LINK="/etc/nginx/sites-enabled/${DOMAIN}"

DB_NAME="altavidatoursdb"
DB_USER="altavidatours"
DB_PASS=""

print_header() {
  echo "=============================================="
  echo "$1"
  echo "=============================================="
}

die() {
  echo "Error: $1" >&2
  exit 1
}

require_root() {
  if [ "$(id -u)" -ne 0 ]; then
    die "This script must be run as root (use sudo)."
  fi
}

# Parse arguments
SUBCOMMAND=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    deploy|createdb)
      SUBCOMMAND="$1"; shift ;;
    --domain)
      DOMAIN="$2"; shift 2 ;;
    --email)
      ADMIN_EMAIL="$2"; shift 2 ;;
    --repo)
      REPO_URL="$2"; shift 2 ;;
    --branch)
      REPO_BRANCH="$2"; shift 2 ;;
    --env_source)
      ENV_SOURCE="$2"; shift 2 ;;
    --app_user)
      APP_USER="$2"; shift 2 ;;
    --app_dir)
      APP_DIR="$2"; shift 2 ;;
    --port)
      APP_PORT="$2"; shift 2 ;;
    --pm2_name)
      PM2_APP_NAME="$2"; shift 2 ;;
    --dbname)
      DB_NAME="$2"; shift 2 ;;
    --dbuser)
      DB_USER="$2"; shift 2 ;;
    --dbpass)
      DB_PASS="$2"; shift 2 ;;
    *)
      die "Unknown argument: $1" ;;
  esac
done

usage() {
  cat <<EOF
Usage:
  sudo bash $0 deploy [--domain <domain>] [--email <email>] [--repo <git_url>] [--branch <branch>] [--env_source <path>] [--app_user <user>] [--app_dir <dir>] [--port <port>] [--pm2_name <name>]
  sudo bash $0 createdb [--dbname <name>] [--dbuser <user>] [--dbpass <password>]
EOF
}

if [[ -z "$SUBCOMMAND" ]]; then
  usage
  exit 1
fi

require_root

# Helpers
ensure_user() {
  local user="$1"
  if id -u "$user" >/dev/null 2>&1; then
    echo "User $user exists"
  else
    print_header "Creating app user: $user"
    adduser --system --group --home "/home/$user" "$user"
  fi
}

setup_prereqs() {
  print_header "Updating apt and installing prerequisites"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg build-essential git ufw
}

setup_node() {
  print_header "Installing Node.js ${NODE_MAJOR}.x and PM2"
  if ! command -v node >/dev/null 2>&1; then
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
    apt-get update -y
    apt-get install -y nodejs
  else
    echo "Node.js already installed: $(node -v)"
  fi
  npm install -g pm2@latest
}

setup_nginx() {
  print_header "Installing Nginx"
  apt-get install -y nginx
  systemctl enable nginx
  systemctl start nginx || true
}

setup_ufw() {
  print_header "Configuring UFW firewall"
  ufw allow OpenSSH || true
  ufw allow 'Nginx Full' || true
  yes | ufw enable || true
}

setup_certbot() {
  print_header "Installing Certbot"
  apt-get install -y certbot python3-certbot-nginx
}

clone_or_update_repo() {
  print_header "Preparing application directory"
  mkdir -p "$APP_DIR"
  chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

  if [[ -n "$REPO_URL" ]]; then
    if [[ ! -d "$APP_DIR/app/.git" ]]; then
      print_header "Cloning repository"
      sudo -u "$APP_USER" git clone "$REPO_URL" -b "$REPO_BRANCH" "$APP_DIR/app"
    else
      print_header "Pulling latest changes"
      pushd "$APP_DIR/app" >/dev/null
      sudo -u "$APP_USER" git fetch --all
      sudo -u "$APP_USER" git checkout "$REPO_BRANCH"
      sudo -u "$APP_USER" git pull --rebase
      popd >/dev/null
    fi
  else
    echo "No REPO_URL provided. Skipping clone/update. Ensure code exists at $APP_DIR/app"
  fi
}

write_env_file() {
  print_header "Configuring environment"
  mkdir -p "$APP_DIR/app"
  if [[ -n "$ENV_SOURCE" && -f "$ENV_SOURCE" ]]; then
    cp "$ENV_SOURCE" "$APP_DIR/app/.env"
  elif [[ ! -f "$APP_DIR/app/.env" ]]; then
    cat > "$APP_DIR/app/.env" <<EOT
# Populate with real secrets before starting in production
NODE_ENV=production
PORT=${APP_PORT}
DATABASE_URL=postgresql://$DB_USER:${DB_PASS:-password}@localhost:5432/$DB_NAME?schema=public
NEXTAUTH_URL=https://${DOMAIN}
EOT
    echo "Created template .env at $APP_DIR/app/.env"
  else
    echo ".env already present at $APP_DIR/app/.env"
  fi
  chown "$APP_USER":"$APP_USER" "$APP_DIR/app/.env"
  chmod 600 "$APP_DIR/app/.env"
}

build_app() {
  print_header "Building application"
  pushd "$APP_DIR/app" >/dev/null
  sudo -u "$APP_USER" npm ci || sudo -u "$APP_USER" npm install
  sudo -u "$APP_USER" npm run build
  popd >/dev/null
}

setup_pm2() {
  print_header "Configuring PM2"
  local ecosystem="${APP_DIR}/ecosystem.config.js"
  cat > "$ecosystem" <<'ECOSYSTEM'
module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || 'altavidatours-web',
      cwd: process.env.APP_DIR ? `${process.env.APP_DIR}/app` : '/var/www/altavidatours/app',
      script: 'node_modules/.bin/next',
      args: 'start -p ' + (process.env.APP_PORT || '3005'),
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '5s',
      max_memory_restart: '512M'
    }
  ]
}
ECOSYSTEM

  export PM2_APP_NAME="$PM2_APP_NAME"
  export APP_DIR="$APP_DIR"
  export APP_PORT="$APP_PORT"

  pm2 start "$ecosystem"
  pm2 save
  pm2 startup systemd -u "$SUDO_USER" --hp "/home/$SUDO_USER" || true
  systemctl enable pm2-$SUDO_USER || true
  systemctl start pm2-$SUDO_USER || true
}

configure_nginx() {
  print_header "Writing Nginx site config for ${DOMAIN}"
  cat > "$NGINX_SITE_PATH" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:${APP_PORT};
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|webp|ico|ttf|otf|woff|woff2)$ {
        proxy_pass http://127.0.0.1:${APP_PORT};
        expires 30d;
        add_header Cache-Control "public";
    }
}
NGINX

  ln -sf "$NGINX_SITE_PATH" "$NGINX_SITE_LINK"
  nginx -t
  systemctl reload nginx
}

obtain_ssl() {
  print_header "Obtaining SSL certificate for ${DOMAIN}"
  # Ensure DNS A record points to this server before running
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" -m "$ADMIN_EMAIL" --agree-tos --redirect --non-interactive || die "Certbot failed. Verify DNS and try again."
  systemctl reload nginx
}

create_db() {
  print_header "Creating PostgreSQL database and user"
  # Install PostgreSQL server if not present
  if ! command -v psql >/dev/null 2>&1; then
    apt-get update -y
    apt-get install -y postgresql
  fi

  if [[ -z "$DB_PASS" ]]; then
    die "--dbpass is required for createdb"
  fi

  # Create user and database idempotently
  sudo -u postgres psql <<SQL
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
      CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
   END IF;
END
$$;

DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = '${DB_NAME}') THEN
      CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
   END IF;
END
$$;

ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL
  echo "PostgreSQL objects ensured: db=${DB_NAME}, user=${DB_USER}"
}

main_deploy() {
  ensure_user "$APP_USER"
  setup_prereqs
  setup_node
  setup_nginx
  setup_ufw
  setup_certbot
  clone_or_update_repo
  write_env_file
  build_app
  setup_pm2
  configure_nginx
  obtain_ssl

  print_header "Deployment completed"
  echo "Domain: https://${DOMAIN}"
  echo "PM2 app: $PM2_APP_NAME"
  echo "App directory: $APP_DIR/app"
}

main_createdb() {
  create_db
}

case "$SUBCOMMAND" in
  deploy)
    main_deploy ;;
  createdb)
    main_createdb ;;
  *)
    usage
    exit 1 ;;

esac
