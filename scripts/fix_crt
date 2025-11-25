# Create webroot directory
sudo mkdir -p /var/www/html/.well-known/acme-challenge

# Create basic Nginx config for treasureegypttours.com
sudo tee /etc/nginx/sites-available/treasureegypttours > /dev/null << 'EOL'
server {
    listen 80;
    server_name treasureegypttours.com www.treasureegypttours.com;
    
    location / {
        return 301 https://$host$request_uri;
    }
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
}
EOL

# Create basic Nginx config for dahabiyatnilecruise.com
sudo tee /etc/nginx/sites-available/Dahabiyat-Nile-Cruise > /dev/null << 'EOL'
server {
    listen 80;
    server_name dahabiyatnilecruise.com www.dahabiyatnilecruise.com;
    
    location / {
        return 301 https://$host$request_uri;
    }
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
}
EOL

# Remove default config if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Create symlinks
sudo ln -sf /etc/nginx/sites-available/treasureegypttours /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/Dahabiyat-Nile-Cruise /etc/nginx/sites-enabled/

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx