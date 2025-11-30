#!/bin/bash

# Configuration
OLD_DOMAIN="altavidatours.com"
NEW_DOMAIN="trasureegypttours.com"
VPS_IP="195.200.4.110"  # Replace with your VPS IP
WEB_SERVER="nginx"     # Change to "apache" if using Apache

# Update system
sudo apt update && sudo apt upgrade -y

# Install certbot if not installed
if ! command -v certbot &> /dev/null; then
    sudo apt install -y certbot python3-certbot-$WEB_SERVER
fi

# Stop web server
sudo systemctl stop $WEB_SERVER

# Update web server configuration
if [ "$WEB_SERVER" = "nginx" ]; then
    # Update Nginx config
    sudo sed -i "s/$OLD_DOMAIN/$NEW_DOMAIN/g" /etc/nginx/sites-available/*
    sudo sed -i "s/www.$OLD_DOMAIN/www.$NEW_DOMAIN/g" /etc/nginx/sites-available/*
    
    # Test Nginx configuration
    sudo nginx -t
else
    # Update Apache config
    sudo sed -i "s/$OLD_DOMAIN/$NEW_DOMAIN/g" /etc/apache2/sites-available/*
    sudo sed -i "s/www.$OLD_DOMAIN/www.$NEW_DOMAIN/g" /etc/apache2/sites-available/*
    
    # Enable required modules
    sudo a2enmod rewrite
    sudo a2enmod ssl
fi

# Get SSL certificate
sudo certbot --$WEB_SERVER -d $NEW_DOMAIN -d www.$NEW_DOMAIN --non-interactive --agree-tos --email admin@$NEW_DOMAIN --redirect

# Update Next.js configuration
NEXT_CONFIG="/path/to/your/project/next.config.js"
if [ -f "$NEXT_CONFIG" ]; then
    sudo sed -i "s/$OLD_DOMAIN/$NEW_DOMAIN/g" $NEXT_CONFIG
fi

# Restart web server
sudo systemctl restart $WEB_SERVER
sudo systemctl status $WEB_SERVER

echo "Domain update completed successfully!"