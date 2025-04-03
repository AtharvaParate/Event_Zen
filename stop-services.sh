#!/bin/bash

# Colors for output
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Stopping Event Zen Services...${NC}"

# Stop frontend (find and kill the npm start process)
echo -e "${BLUE}Stopping frontend...${NC}"
pkill -f "react-scripts start"

# Stop backend services
echo -e "${BLUE}Stopping backend services...${NC}"
cd backend
docker-compose down
cd ..

echo -e "${RED}All services have been stopped!${NC}" 