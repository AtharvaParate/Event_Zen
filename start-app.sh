#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ports used by the application
PORTS=(3000 8080 8081 8082 8083 8084 27017 5432)

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

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}Docker is not running. Please start Docker Desktop first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Docker is running.${NC}"
}

# Function to stop and remove existing containers
cleanup() {
    echo -e "${BLUE}Cleaning up existing containers...${NC}"
    docker compose down -v
    echo -e "${GREEN}Cleanup completed.${NC}"
}

# Function to free all ports
free_ports() {
    echo -e "${BLUE}Checking and freeing ports...${NC}"
    for port in "${PORTS[@]}"; do
        free_port $port
    done
    echo -e "${GREEN}Port check completed.${NC}"
}

# Function to start services
start_services() {
    echo -e "${BLUE}Starting services...${NC}"
    docker compose up -d
    echo -e "${GREEN}Services started.${NC}"
}

# Function to check if services are ready
check_services() {
    echo -e "${BLUE}Waiting for services to be ready...${NC}"
    
    # Wait for MongoDB
    echo -e "${YELLOW}Waiting for MongoDB...${NC}"
    until docker exec eventzen-mongodb mongosh --eval "db.version()" >/dev/null 2>&1; do
        sleep 2
    done
    echo -e "${GREEN}MongoDB is ready.${NC}"
    
    # Wait for PostgreSQL
    echo -e "${YELLOW}Waiting for PostgreSQL...${NC}"
    until docker exec eventzen-postgres pg_isready -U eventzen -d budget_service >/dev/null 2>&1; do
        sleep 2
    done
    echo -e "${GREEN}PostgreSQL is ready.${NC}"
    
    # Wait for Gateway Service
    echo -e "${YELLOW}Waiting for Gateway Service...${NC}"
    until curl -s http://localhost:8080/actuator/health >/dev/null; do
        sleep 2
    done
    echo -e "${GREEN}Gateway Service is ready.${NC}"
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}Starting frontend...${NC}"
    cd frontend
    
    # Check if node_modules exists, if not install dependencies
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Start frontend in the background
    echo -e "${YELLOW}Starting frontend development server...${NC}"
    npm start &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > .frontend.pid
    
    # Wait a bit for the frontend to start
    sleep 5
    echo -e "${GREEN}Frontend is running at http://localhost:3000${NC}"
}

# Function to stop frontend
stop_frontend() {
    if [ -f ".frontend.pid" ]; then
        echo -e "${BLUE}Stopping frontend...${NC}"
        kill $(cat .frontend.pid) 2>/dev/null || true
        rm .frontend.pid
        echo -e "${GREEN}Frontend stopped.${NC}"
    fi
}

# Function to handle cleanup on script exit
cleanup_on_exit() {
    echo -e "${BLUE}Cleaning up...${NC}"
    stop_frontend
    cleanup
    free_ports
    echo -e "${GREEN}Cleanup completed.${NC}"
    exit 0
}

# Set up trap to handle script termination
trap cleanup_on_exit SIGINT SIGTERM

# Main execution
echo -e "${BLUE}Starting Event Zen Application...${NC}"

# Step 1: Check Docker
check_docker

# Step 2: Free ports
free_ports

# Step 3: Cleanup existing containers
cleanup

# Step 4: Start services
start_services

# Step 5: Check if services are ready
check_services

# Step 6: Start frontend
start_frontend

echo -e "${GREEN}Event Zen Application is ready!${NC}"
echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}Backend API: http://localhost:8080/api${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the application${NC}"

# Keep the script running
while true; do
    sleep 1
done 