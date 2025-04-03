#!/bin/bash

# Colors for output
RED='\033[0;31m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up databases for Event Zen services...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start MongoDB container if not running
if ! docker ps | grep -q "eventzen-mongodb"; then
    echo -e "${BLUE}Starting MongoDB container...${NC}"
    docker run -d \
        --name eventzen-mongodb \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
        mongo:latest
fi

# Wait for MongoDB to be ready
echo -e "${BLUE}Waiting for MongoDB to be ready...${NC}"
sleep 5

# Create databases and users for MongoDB
echo -e "${BLUE}Creating MongoDB databases and users...${NC}"
docker exec eventzen-mongodb mongosh -u admin -p admin123 --eval '
    db = db.getSiblingDB("eventzen");
    db.createUser({
        user: "eventzen",
        pwd: "eventzen123",
        roles: [{ role: "readWrite", db: "eventzen" }]
    });
    
    db = db.getSiblingDB("eventzen_attendees");
    db.createUser({
        user: "eventzen",
        pwd: "eventzen123",
        roles: [{ role: "readWrite", db: "eventzen_attendees" }]
    });
    
    db = db.getSiblingDB("attendee_service");
    db.createUser({
        user: "eventzen",
        pwd: "eventzen123",
        roles: [{ role: "readWrite", db: "attendee_service" }]
    });
'

# Start PostgreSQL container if not running
if ! docker ps | grep -q "eventzen-postgres"; then
    echo -e "${BLUE}Starting PostgreSQL container...${NC}"
    docker run -d \
        --name eventzen-postgres \
        -p 5432:5432 \
        -e POSTGRES_USER=eventzen \
        -e POSTGRES_PASSWORD=eventzen123 \
        -e POSTGRES_DB=budget_service \
        postgres:latest
fi

# Wait for PostgreSQL to be ready
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
sleep 5

echo -e "${GREEN}Database setup complete!${NC}"
echo -e "${GREEN}MongoDB is running on port 27017${NC}"
echo -e "${GREEN}PostgreSQL is running on port 5432${NC}"
echo -e "${GREEN}You can now start the services using ./start-services.sh${NC}" 