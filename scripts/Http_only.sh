# Create a temporary config for dahabiyatnilecruise.com
sudo tee /etc/nginx/sites-available/dahabiyat_temp > /dev/null << 'EOL'
server {
    listen 80;
    server_name dahabiyatnilecruise.com www.dahabiyatnilecruise.com;
    root /var/www/html;
    
    location / {
        return 404;
    }
    
    location /.well-known/acme-challenge/ {
        allow all;
    }
}
EOL

# Enable the temporary config
sudo ln -sf /etc/nginx/sites-available/dahabiyat_temp /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/dahabiyatnilecruise

# Test and restart Nginx
sudo nginx -t && sudo systemctl restart nginx