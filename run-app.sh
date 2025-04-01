#!/bin/bash

echo "=== Starting Event Zen Application ==="
echo "Initializing databases and services..."

# Initialize database scripts
./scripts/init-db.sh

# Start all services using Docker Compose
docker-compose up -d

echo "=== Event Zen Application is now running! ==="
echo "Frontend is available at: http://localhost:3000"
echo "API endpoints are available at:"
echo "  - Auth Service:   http://localhost:8081/api"
echo "  - Event Service:  http://localhost:8082/api"
echo "  - Budget Service: http://localhost:8083/api"
echo "  - Vendor Service: http://localhost:8084/api"
echo "  - Venue Service:  http://localhost:8085/api"
echo ""
echo "Sample Users:"
echo "  - Admin:     admin@eventzen.com / password123"
echo "  - Organizer: organizer@eventzen.com / password123"
echo "  - User:      user@eventzen.com / password123"
echo ""
echo "To stop the application, run: docker-compose down" 