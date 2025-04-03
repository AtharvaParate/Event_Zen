#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to free a port
free_port() {
    local port=$1
    if port_in_use $port; then
        echo -e "${YELLOW}Port $port is in use. Attempting to free it...${NC}"
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
        if port_in_use $port; then
            echo -e "${RED}Failed to free port $port. Please free it manually.${NC}"
            return 1
        else
            echo -e "${GREEN}Port $port freed successfully.${NC}"
            return 0
        fi
    fi
    return 0
}

# Function to check if a service is running
check_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    echo -e "${BLUE}Waiting for $service to be ready...${NC}"
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port >/dev/null; then
            echo -e "${GREEN}$service is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}Attempt $attempt/$max_attempts: $service not ready yet...${NC}"
        sleep 2
        ((attempt++))
    done
    echo -e "${RED}$service failed to start within the expected time.${NC}"
    return 1
}

# Function to check if PostgreSQL is ready
check_postgres() {
    local max_attempts=30
    local attempt=1

    echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
    while [ $attempt -le $max_attempts ]; do
        if docker exec eventzen-postgres pg_isready -U eventzen -d budget_service >/dev/null 2>&1; then
            echo -e "${GREEN}PostgreSQL is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}Attempt $attempt/$max_attempts: PostgreSQL not ready yet...${NC}"
        sleep 2
        ((attempt++))
    done
    echo -e "${RED}PostgreSQL failed to start within the expected time.${NC}"
    return 1
}

# Function to clean up containers
cleanup_containers() {
    echo -e "${BLUE}Cleaning up containers...${NC}"
    docker rm -f eventzen-mongodb eventzen-postgres eventzen-gateway eventzen-event-service eventzen-attendee-service eventzen-budget-service eventzen-auth-service 2>/dev/null || true
    docker volume rm event_zen_mongodb_data event_zen_postgres_data 2>/dev/null || true
    echo -e "${GREEN}Cleanup completed!${NC}"
}

# Check if Docker is installed
if ! command_exists docker; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    echo -e "${YELLOW}Download Docker Desktop from: https://www.docker.com/products/docker-desktop/${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker first.${NC}"
    echo -e "${YELLOW}Start Docker Desktop and wait for it to be ready.${NC}"
    exit 1
fi

echo -e "${BLUE}Starting Event Zen Services...${NC}"

# Step 1: Free up ports
echo -e "${BLUE}Step 1: Freeing up ports...${NC}"
PORTS=(3000 8080 8081 8082 8083 8084)
for port in "${PORTS[@]}"; do
    if ! free_port $port; then
        echo -e "${RED}Failed to free port $port. Please free it manually and try again.${NC}"
        exit 1
    fi
done
echo -e "${GREEN}All ports freed successfully!${NC}"

# Step 2: Clean up existing containers and volumes
cleanup_containers

# Step 3: Initialize databases
echo -e "${BLUE}Step 3: Initializing databases...${NC}"
if [ ! -f "./scripts/init-db.sh" ]; then
    echo -e "${RED}Database initialization script not found!${NC}"
    exit 1
fi

chmod +x ./scripts/init-db.sh
./scripts/init-db.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}Database initialization failed!${NC}"
    exit 1
fi
echo -e "${GREEN}Databases initialized successfully!${NC}"

# Step 4: Start all services
echo -e "${BLUE}Step 4: Starting all services...${NC}"
if [ ! -f "./docker-compose.yml" ]; then
    echo -e "${RED}Docker Compose file not found!${NC}"
    exit 1
fi

# Start MongoDB and PostgreSQL first
echo -e "${BLUE}Starting databases...${NC}"
docker compose up -d mongodb postgres

# Wait for databases to be ready
echo -e "${BLUE}Waiting for databases to be ready...${NC}"
sleep 10

# Check if databases are running
if ! docker ps | grep -q "eventzen-mongodb" || ! docker ps | grep -q "eventzen-postgres"; then
    echo -e "${RED}Databases failed to start. Please check the logs using: docker compose logs${NC}"
    exit 1
fi

# Check if PostgreSQL is ready
if ! check_postgres; then
    echo -e "${RED}PostgreSQL failed to start properly. Please check the logs using: docker compose logs postgres${NC}"
    exit 1
fi

# Start the rest of the services
echo -e "${BLUE}Starting application services...${NC}"
docker compose up -d

# Wait for services to be ready
echo -e "${BLUE}Step 5: Waiting for services to be ready...${NC}"

# Check MongoDB
check_service "MongoDB" 27017

# Check Gateway Service
check_service "Gateway Service" 8080

# Check Event Service
check_service "Event Service" 8081

# Check Attendee Service
check_service "Attendee Service" 8082

# Check Budget Service
check_service "Budget Service" 8083

# Check Auth Service
check_service "Auth Service" 8084

echo -e "${GREEN}All services started successfully!${NC}"
echo -e "${GREEN}You can access the application at: http://localhost:3000${NC}"
echo -e "${GREEN}Backend Gateway is available at: http://localhost:8080${NC}"
echo -e "${GREEN}MongoDB is running on port 27017${NC}"
echo -e "${GREEN}PostgreSQL is running on port 5432${NC}"

# Start the frontend
echo -e "${BLUE}Step 6: Starting frontend...${NC}"
cd frontend
npm start 