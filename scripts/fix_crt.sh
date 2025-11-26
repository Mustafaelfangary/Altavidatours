# Create treasureegypttours config
sudo tee /etc/nginx/sites-available/treasureegypttours > /dev/null << 'EOL'
server {
    listen 80;
    server_name treasureegypttours.com www.treasureegypttours.com;
    root /var/www/html;
    
    location / {
        return 301 https://$host$request_uri;
    }
    
    location /.well-known/acme-challenge/ {
        allow all;
    }
}

server {
    listen 443 ssl http2;
    server_name treasureegypttours.com www.treasureegypttours.com;

    ssl_certificate /etc/letsencrypt/live/treasureegypttours.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/treasureegypttours.com/privkey.pem;
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
EOL

# Create dahabiyatnilecruise config
sudo tee /etc/nginx/sites-available/dahabiyatnilecruise > /dev/null << 'EOL'
server {
    listen 80;
    server_name dahabiyatnilecruise.com www.dahabiyatnilecruise.com;
    root /var/www/html;
    
    location / {
        return 301 https://$host$request_uri;
    }
    
    location /.well-known/acme-challenge/ {
        allow all;
    }
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
EOL