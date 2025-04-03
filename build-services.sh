#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building Event Zen Services...${NC}"

# Check if Maven is installed
if ! command -v mvn >/dev/null 2>&1; then
    echo -e "${RED}Maven is not installed. Please install Maven first.${NC}"
    echo -e "${YELLOW}Download Maven from: https://maven.apache.org/download.cgi${NC}"
    exit 1
fi

# Build Gateway Service
echo -e "${BLUE}Building Gateway Service...${NC}"
cd backend/gateway-service
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build Gateway Service${NC}"
    exit 1
fi
cd ../..

# Build Event Service
echo -e "${BLUE}Building Event Service...${NC}"
cd backend/event-service
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build Event Service${NC}"
    exit 1
fi
cd ../..

# Build Attendee Service
echo -e "${BLUE}Building Attendee Service...${NC}"
cd backend/attendee-service
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build Attendee Service${NC}"
    exit 1
fi
cd ../..

# Build Budget Service
echo -e "${BLUE}Building Budget Service...${NC}"
cd backend/budget-service
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build Budget Service${NC}"
    exit 1
fi
cd ../..

# Build Auth Service
echo -e "${BLUE}Building Auth Service...${NC}"
cd backend/auth-service
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build Auth Service${NC}"
    exit 1
fi
cd ../..

echo -e "${GREEN}All services built successfully!${NC}"
echo -e "${GREEN}You can now run ./start-services.sh to start the services${NC}" 