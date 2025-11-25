#!/bin/bash

# Fix port configuration script for Dahabiyat (3000) and TreasureEgyptTours (3001)

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
    
    # Update Nginx
    sudo sed -i 's/proxy_pass http:\/\/127.0.0.1:[0-9]\+/proxy_pass http:\/\/127.0.0.1:3000/' /etc/nginx/sites-enabled/Dahabiyat-Nile-Cruise
else
    echo -e "${RED}Error: Dahabiyat-Nile-Cruise directory not found at $DAHABIYAT_DIR${NC}"
fi

# Configure TreasureEgyptTours (Port 3001)
echo -e "${YELLOW}Configuring TreasureEgyptTours on port 3001...${NC}"
TREASURE_DIR="/var/www/treasureegypttours"
if [ -d "$TREASURE_DIR" ]; then
    # Update .env
    sed -i 's/PORT=.*/PORT=3001/' "$TREASURE_DIR/.env"
    sed -i 's/NEXT_PUBLIC_SITE_URL=.*/NEXT_PUBLIC_SITE_URL=https:\/\/treasureegypttours.com/' "$TREASURE_DIR/.env"
    
    # Update Nginx
    sudo sed -i 's/proxy_pass http:\/\/127.0.0.1:[0-9]\+/proxy_pass http:\/\/127.0.0.1:3001/' /etc/nginx/sites-enabled/treasureegypttours
else
    echo -e "${RED}Error: TreasureEgyptTours directory not found at $TREASURE_DIR${NC}"
fi

# Test Nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
sudo nginx -t
if [ $? -eq 0 ]; then
    # Restart Nginx
    echo -e "${YELLOW}Restarting Nginx...${NC}"
    sudo systemctl restart nginx
    
    # Restart applications
    echo -e "${YELLOW}Restarting applications...${NC}"
    pm2 start Dahabiyat-Nile-Cruise
    pm2 start treasureegypttours
    pm2 save
    
    # Show status
    echo -e "\n${GREEN}Configuration complete!${NC}"
    echo -e "\n${YELLOW}Application Status:${NC}"
    pm2 status
    
    echo -e "\n${YELLOW}Listening Ports:${NC}"
    sudo lsof -i -P -n | grep LISTEN
    
    echo -e "\n${GREEN}Verification:${NC}"
    echo "Dahabiyat: http://localhost:3000"
    echo "Treasure:  http://localhost:3001"
else
    echo -e "${RED}Nginx configuration test failed. Please check the configuration.${NC}"
    exit 1
fi