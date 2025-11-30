#!/usr/bin/env bash
set -euo pipefail

# ========= CONFIG =========
DOMAIN="altavidatours.com"
WWW_DOMAIN="www.altavidatours.com"
APP_NAME="altavidatours"
APP_DIR="/var/www/altavidatours"
PORT="3001"  # Using port 3001 for multiple sites

# Clone this repo automatically
REPO_URL="https://github.com/Mustafaelfangary/Altavidatours"
BRANCH="main"

ENV_CONTENT=$'NODE_ENV=production\nPORT=3001\nNEXT_PUBLIC_SITE_URL=https://www.altavidatours.com\nNEXTAUTH_URL=https://www.altavidatours.com\n# DATABASE_URL=<your-db-url-if-used>\n# NEXTAUTH_SECRET=<random-strong-secret-if-used>'
# ========= END CONFIG =========

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if running as root
check_root() {
    if [ "$(id -u)" -ne 0 ]; then
        print_error "Please run as root or with sudo."
    fi
}

# Install required packages
install_dependencies() {
    print_status "Updating system packages and installing dependencies..."
    
    apt update -y
    apt upgrade -y
    apt install -y nginx ufw curl git

    # Install Node.js LTS if not present
    if ! command -v node >/dev/null 2>&1; then
        print_status "Installing Node.js LTS..."
        curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
        apt install -y nodejs
    fi

    # Install PM2 globally if not present
    if ! command -v pm2 >/dev/null 2>&1; then
        print_status "Installing PM2..."
        npm i -g pm2
    fi

    # Install Certbot via snap (recommended)
    print_status "Setting up Certbot..."
    snap install core || true
    snap refresh core || true
    if ! snap list | grep -q certbot; then
        snap install --classic certbot
    fi
    if [ ! -e /usr/bin/certbot ]; then
        ln -s /snap/bin/certbot /usr/bin/certbot || true
    fi
}

# Configure firewall
setup_firewall() {
    print_status "Configuring UFW firewall..."
    ufw allow OpenSSH || true
    ufw allow 'Nginx Full' || true
    ufw --force enable || true
    ufw status || true
}

# Setup application directory and permissions
setup_app_directory() {
    print_status "Setting up application directory: $APP_DIR"
    mkdir -p "$APP_DIR"
    
    # Set ownership to the logged-in sudo user if available
    if [ -n "${SUDO_USER:-}" ] && id "$SUDO_USER" >/dev/null 2>&1; then
        chown -R $SUDO_USER:$SUDO_USER "$APP_DIR" || true
    fi
}

# Clone or update repository
setup_repository() {
    print_status "Setting up repository..."
    
    if [ -d "$APP_DIR/.git" ]; then
        print_status "Repository exists. Pulling latest changes from $BRANCH branch..."
        su - ${SUDO_USER:-root} -c "cd $APP_DIR && git fetch && git checkout $BRANCH && git pull --ff-only origin $BRANCH"
    else
        print_status "Cloning repository $REPO_URL into $APP_DIR..."
        su - ${SUDO_USER:-root} -c "cd $APP_DIR/.. && git clone -b $BRANCH $REPO_URL $(basename $APP_DIR)"
    fi
}

# Install dependencies and build the application
build_application() {
    print_status "Installing dependencies and building the application..."
    
    cd "$APP_DIR"
    
    # Install dependencies
    if [ -f "package-lock.json" ]; then
        su - ${SUDO_USER:-root} -c "cd $APP_DIR && npm ci"
    else
        su - ${SUDO_USER:-root} -c "cd $APP_DIR && npm install"
    fi
    
    # Build the application
    su - ${SUDO_USER:-root} -c "cd $APP_DIR && npm run build"
    
    # Set up environment file if needed
    if [ "$WRITE_ENV" -eq 1 ] && [ ! -f "$APP_DIR/.env" ]; then
        print_status "Creating .env file..."
        ENV_MODIFIED=$(echo "$ENV_CONTENT" | sed "s/PORT=3001/PORT=$PORT/g")
        echo "$ENV_MODIFIED" > "$APP_DIR/.env"
        chmod 600 "$APP_DIR/.env"
    fi
}

# Configure PM2 process
setup_pm2() {
    print_status "Configuring PM2 process..."
    
    # Check if process exists
    if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
        print_status "Restarting existing PM2 process for $APP_NAME..."
        PORT="$PORT" pm2 restart "$APP_NAME" --update-env
    else
        print_status "Starting new PM2 process for $APP_NAME on port $PORT..."
        cd "$APP_DIR" && PORT="$PORT" pm2 start npm --name "$APP_NAME" -- start
    fi
    
    # Save PM2 process list
    pm2 save
    
    # Set up PM2 startup
    if [ -n "${SUDO_USER:-}" ] && id "$SUDO_USER" >/dev/null 2>&1; then
        pm2 startup -u $SUDO_USER --hp "/home/$SUDO_USER" || true
    else
        pm2 startup || true
    fi
}

# Configure Nginx
setup_nginx() {
    print_status "Configuring Nginx for $DOMAIN..."
    
    NGINX_SITE="/etc/nginx/sites-available/$APP_NAME"
    
    # Create Nginx configuration
    cat > "$NGINX_SITE" <<EOF
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN;
    return 301 https://\$host\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN $WWW_DOMAIN;

    # SSL configuration
    ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Static assets
    location /_next/static/ {
        alias $APP_DIR/.next/static/;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public/ {
        alias $APP_DIR/public/;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Proxy to Node.js
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/x-javascript application/xml application/xml+rss application/atom+xml image/svg+xml;
}
EOF

    # Enable the site
    ln -sf "$NGINX_SITE" "/etc/nginx/sites-enabled/$APP_NAME"
    
    # Test Nginx configuration
    if ! nginx -t; then
        print_error "Nginx configuration test failed. Please check the configuration."
    fi
    
    systemctl reload nginx
}

# Setup SSL with Let's Encrypt
setup_ssl() {
    print_status "Setting up SSL certificate for $DOMAIN..."
    
    # Check if certificate already exists
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        print_status "SSL certificate already exists for $DOMAIN. Renewing..."
        certbot renew --quiet --no-self-upgrade
    else
        print_status "Requesting new SSL certificate for $DOMAIN and $WWW_DOMAIN..."
        certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" || {
            print_warning "Certbot failed to issue certificate. Please check DNS settings and try again."
            print_warning "You can manually run: certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
        }
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check if the service is running
    if ! pm2 describe "$APP_NAME" >/dev/null 2>&1; then
        print_error "PM2 process $APP_NAME is not running!"
    fi
    
    # Check Nginx configuration
    if ! nginx -t; then
        print_error "Nginx configuration test failed after setup!"
    fi
    
    # Test HTTP and HTTPS endpoints
    print_status "Testing HTTP/HTTPS endpoints..."
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" || true)
    local https_status=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" || true)
    
    if [ "$http_status" != "301" ]; then
        print_warning "HTTP request to $DOMAIN returned status $http_status (expected 301)"
    fi
    
    if [ "$https_status" != "200" ]; then
        print_warning "HTTPS request to $DOMAIN returned status $https_status (expected 200)"
    fi
    
    # Show PM2 status
    pm2 status
}

# Main deployment function
main() {
    echo -e "\n${BLUE}🚀 Altavida Tours Deployment Script${NC}"
    echo -e "${BLUE}===================================${NC}\n"
    
    # Check for root privileges
    check_root
    
    # Install dependencies
    install_dependencies
    
    # Setup firewall
    setup_firewall
    
    # Setup application directory
    setup_app_directory
    
    # Setup repository
    setup_repository
    
    # Build application
    build_application
    
    # Setup PM2
    setup_pm2
    
    # Setup Nginx
    setup_nginx
    
    # Setup SSL
    setup_ssl
    
    # Verify deployment
    verify_deployment
    
    print_success "🎉 Deployment completed successfully!"
    echo -e "\nNext steps:"
    echo "1. Your application is running on port $PORT"
    echo "2. Nginx is configured to serve your site at:"
    echo "   - https://$DOMAIN"
    echo "   - https://$WWW_DOMAIN"
    echo "3. To monitor your application:"
    echo "   - PM2: pm2 monit"
    echo "   - Logs: pm2 logs $APP_NAME"
    echo "4. SSL auto-renewal is set up via certbot"
    echo "   - Check renewal: systemctl list-timers | grep certbot"
    echo -e "\n${GREEN}✅ Deployment completed!${NC}\n"
}

# Run the main function
main "$@"