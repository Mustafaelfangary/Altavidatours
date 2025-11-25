# Create a new Nginx configuration with the updated domain
sudo tee /etc/nginx/sites-available/dahabiyat > /dev/null << 'EOL'
server {
    listen 80;
    server_name dahabiyat.com www.dahabiyat.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dahabiyat.com www.dahabiyat.com;

    ssl_certificate /etc/letsencrypt/live/dahabiyat.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dahabiyat.com/privkey.pem;
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