# Create a temporary config to allow Let's Encrypt verification
sudo tee /etc/nginx/sites-available/letsencrypt > /dev/null << 'EOL'
server {
    listen 80;
    server_name dahabiyat.com www.dahabiyat.com;
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
sudo ln -sf /etc/nginx/sites-available/letsencrypt /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/dahabiyat

# Test and restart Nginx
sudo nginx -t && sudo systemctl restart nginx