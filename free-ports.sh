#!/bin/bash

# Colors for output
RED='\033[0;31m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Docker command with correct path
DOCKER_CMD="docker"

echo -e "${BLUE}Freeing up ports for Event Zen services...${NC}"

# Function to kill process on a specific port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo -e "${RED}Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid
    else
        echo -e "${GREEN}Port $port is already free${NC}"
    fi
}

# Kill processes on all required ports
echo -e "${BLUE}Checking and freeing ports...${NC}"
kill_port 3000  # Frontend
kill_port 8080  # Gateway
kill_port 8761  # Eureka
kill_port 8081  # Event Service
kill_port 8082  # Attendee Service
kill_port 8083  # Budget Service
kill_port 8084  # User Service

# Additional check for Docker containers
echo -e "${BLUE}Checking for running Docker containers...${NC}"
if [ "$($DOCKER_CMD ps -q)" ]; then
    echo -e "${RED}Stopping all running Docker containers...${NC}"
    $DOCKER_CMD stop $($DOCKER_CMD ps -q)
    $DOCKER_CMD rm $($DOCKER_CMD ps -aq)
else
    echo -e "${GREEN}No running Docker containers found${NC}"
fi

echo -e "${GREEN}All ports have been freed!${NC}"
echo -e "${GREEN}You can now start the services using ./start-services.sh${NC}" 