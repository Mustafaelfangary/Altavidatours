#!/bin/bash

# Fix port configuration script for Dahabiyat (3000) and AltavidaTours (3001)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting port configuration fix...${NC}"

# Stop both applications
echo -e "${YELLOW}Stopping applications...${NC}"
pm2 stop all

# Configure Dahabiyat-Nile-Cruise (Port 3000)
echo -e "${YELLOW}Configuring Dahabiyat-Nile-Cruise on port 3000...${NC}"
DAHABIYAT_DIR="/var/Dahabiyat-Nile-Cruise"
if [ -d "$DAHABIYAT_DIR" ]; then
    # Update .env
    sed -i 's/PORT=.*/PORT=3000/' "$DAHABIYAT_DIR/.env"
    sed -i 's/NEXT_PUBLIC_SITE_URL=.*/NEXT_PUBLIC_SITE_URL=https:\/\/dahabiyatnilecruise.com/' "$DAHABIYAT_DIR/.env"
    
    # Update Nginx if config exists
    if [ -f "/etc/nginx/sites-enabled/Dahabiyat-Nile-Cruise" ]; then
        sudo sed -i 's/proxy_pass http:\/\/127.0.0.1:[0-9]\+/proxy_pass http:\/\/127.0.0.1:3000/' /etc/nginx/sites-enabled/Dahabiyat-Nile-Cruise
    else
        echo -e "${YELLOW}Nginx config for Dahabiyat not found, creating it...${NC}"
        sudo bash -c 'cat > /etc/nginx/sites-available/Dahabiyat-Nile-Cruise << "EOL"
server {
    listen 80;
    server_name dahabiyatnilecruise.com www.dahabiyatnilecruise.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dahabiyatnilecruise.com www.dahabiyatnilecruise.com;

    ssl_certificate /etc/letsencrypt/live/dahabiyatnilecruise.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dahabiyatnilecruise.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOL'
        sudo ln -sf /etc/nginx/sites-available/Dahabiyat-Nile-Cruise /etc/nginx/sites-enabled/
    fi
else
    echo -e "${RED}Error: Dahabiyat-Nile-Cruise directory not found at $DAHABIYAT_DIR${NC}"
fi

# Configure AltavidaTours (Port 3001)
echo -e "${YELLOW}Configuring AltavidaTours on port 3001...${NC}"
TREASURE_DIR="/var/www/altavidatours"
if [ -d "$TREASURE_DIR" ]; then
    # Update .env
    sed -i 's/PORT=.*/PORT=3001/' "$TREASURE_DIR/.env"
    sed -i 's/NEXT_PUBLIC_SITE_URL=.*/NEXT_PUBLIC_SITE_URL=https:\/\/altavidatours.com/' "$TREASURE_DIR/.env"
    
    # Update Nginx if config exists
    if [ -f "/etc/nginx/sites-enabled/altavidatours" ]; then
        sudo sed -i 's/proxy_pass http:\/\/127.0.0.1:[0-9]\+/proxy_pass http:\/\/127.0.0.1:3001/' /etc/nginx/sites-enabled/altavidatours
    else
        echo -e "${YELLOW}Nginx config for AltavidaTours not found, creating it...${NC}"
        sudo bash -c 'cat > /etc/nginx/sites-available/altavidatours << "EOL"
server {
    listen 80;
    server_name altavidatours.com www.altavidatours.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name altavidatours.com www.altavidatours.com;

    ssl_certificate /etc/letsencrypt/live/altavidatours.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/altavidatours.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOL'
        sudo ln -sf /etc/nginx/sites-available/altavidatours /etc/nginx/sites-enabled/
    fi
else
    echo -e "${RED}Error: AltavidaTours directory not found at $TREASURE_DIR${NC}"
fi

# Test Nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
if sudo nginx -t; then
    # Restart Nginx
    echo -e "${YELLOW}Restarting Nginx...${NC}"
    sudo systemctl restart nginx
    
    # Restart applications
    echo -e "${YELLOW}Restarting applications...${NC}"
    cd "$DAHABIYAT_DIR" && pm2 start npm --name "Dahabiyat-Nile-Cruise" -- start
    cd "$TREASURE_DIR" && pm2 start npm --name "altavidatours" -- start
    pm2 save
    
    # Show status
    echo -e "\n${GREEN}Configuration complete!${NC}"
    echo -e "\n${YELLOW}Application Status:${NC}"
    pm2 status
    
    echo -e "\n${YELLOW}Listening Ports:${NC}"
    sudo lsof -i -P -n | grep LISTEN
    
    echo -e "\n${GREEN}Verification:${NC}"
    echo "Dahabiyat: http://localhost:3000"
    echo "Altavida:  http://localhost:3001"
else
    echo -e "${RED}Nginx configuration test failed. Please check the configuration.${NC}"
    echo -e "${YELLOW}To fix SSL certificates, run:${NC}"
    echo "sudo certbot --nginx -d altavidatours.com -d www.altavidatours.com"
    echo "sudo certbot --nginx -d dahabiyatnilecruise.com -d www.dahabiyatnilecruise.com"
    exit 1
fi