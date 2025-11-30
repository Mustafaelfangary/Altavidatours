#!/bin/bash

# Update system and install required packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx nodejs npm git

# Install PM2 globally
sudo npm install -g pm2

# Create a directory for the application
sudo mkdir -p /var/www/altavidatours
sudo chown -R $USER:$USER /var/www/altavidatours
cd /var/www/altavidatours

# Clone the repository
git clone https://github.com/Mustafaelfangary/Altavidatours.git .
npm install

# Build the application (if it's a Node.js app)
# npm run build

# Configure PM2 to manage the application
pm2 start npm --name "altavidatours" -- start
pm2 save
pm2 startup

# Configure Nginx
sudo bash -c 'cat > /etc/nginx/sites-available/altavidatours << EOL
server {
    listen 80;
    server_name altavidatours.com www.altavidatours.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /static {
        alias /var/www/altavidatours/static;
    }
}
EOL'

# Enable the site
sudo ln -s /etc/nginx/sites-available/altavidatours /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL with Let's Encrypt
sudo certbot --nginx -d altavidatours.com -d www.altavidatours.com --non-interactive --agree-tos -m admin@altavidatours.com

# Set up automatic renewal for SSL
(sudo crontab -l 2>/dev/null; echo "0 0 * * * /usr/bin/certbot renew --quiet") | sudo crontab -

# Configure firewall
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'
sudo ufw enable

echo "Deployment completed! Your site should now be live at https://altavidatours.com"