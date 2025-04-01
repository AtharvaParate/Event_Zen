#!/bin/bash

# Create required directories
mkdir -p scripts/auth-db
mkdir -p scripts/event-db
mkdir -p scripts/budget-db
mkdir -p scripts/vendor-db
mkdir -p scripts/venue-db

# Copy initialization scripts
cp -f scripts/auth-db/init.sql scripts/auth-db/
cp -f scripts/event-db/init.sql scripts/event-db/
cp -f scripts/budget-db/init.sql scripts/budget-db/
cp -f scripts/vendor-db/init.sql scripts/vendor-db/
cp -f scripts/venue-db/init.sql scripts/venue-db/

# Set permissions on scripts
chmod +x scripts/auth-db/init.sql
chmod +x scripts/event-db/init.sql
chmod +x scripts/budget-db/init.sql
chmod +x scripts/vendor-db/init.sql
chmod +x scripts/venue-db/init.sql

# Bring up all services using Docker Compose
docker-compose up -d

echo "All services are now running!"
echo "Frontend is available at http://localhost:3000"
echo "Backend APIs are available at:"
echo "- Auth Service: http://localhost:8081/api"
echo "- Event Service: http://localhost:8082/api"
echo "- Budget Service: http://localhost:8083/api"
echo "- Vendor Service: http://localhost:8084/api"
echo "- Venue Service: http://localhost:8085/api"
echo ""
echo "To view logs, use: docker-compose logs -f [service-name]"
echo "To stop all services, use: docker-compose down" 