# Deploy to Hostinger VPS — guide

This repository includes an automated deployment script to help set up and deploy this website on an Ubuntu 22.04 VPS (Hostinger).

Files created:
- scripts/deploy-hostinger.sh — main deployment script (run on server with sudo)
- scripts/nginx-site-template.conf — a template you can use as a starting point for an Nginx site block

Before you run
- Ensure your VPS has a public domain name pointing to it (A record) because certbot will need it.
- Confirm the server runs Ubuntu 22.04 and you have a sudo user.

Example: run this on the VPS

1) Copy the script to the server (or create it there) and make it executable:

```bash
# on your workstation
scp scripts/deploy-hostinger.sh user@your.server.ip:/home/user/

# on the server
sudo mv ~/deploy-hostinger.sh /usr/local/bin/deploy-hostinger.sh
sudo chmod +x /usr/local/bin/deploy-hostinger.sh
```

2) Run the script (example):

```bash
sudo /usr/local/bin/deploy-hostinger.sh \
  --repo "git@github.com:Mustafaelfangary/Altavidatours.git" \
  --branch "main" \
  --domain "altavidatours.example.com" \
  --email "admin@example.com" \
  --app-port 3003 \
  --app-dir "/var/www/altavidatours" \
  --pm2-name "altavidatours" \
  --db-name "altavidatours_db" \
  --db-user "altavidatours_user" \
  --db-pass "1082-034ASas"
```

Notes & tips
- If a previous site already uses the port you choose, select another port.
- The script uses certbot (snap) to request certificates with `--nginx` plugin. If it fails, run the certbot command shown by the script manually.
- The script will create a PostgreSQL database and user with the credentials you provided.
- For multi-site servers (you mentioned 3 other websites on ports 3000..3003), pick an unused port (e.g. 3004) and update the Nginx server block accordingly.

If you want, I can:
- Generate a more complete systemd + pm2 ecosystem file for zero-downtime deployment.
- Extend the script to set environment variables from a secure source and manage secrets with systemd secrets or dotenv.
- Create scripts to migrate data (Prisma migrations etc.) and to seed the DB using provided .docx content.
