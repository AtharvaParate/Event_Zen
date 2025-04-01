# Event Zen - Setup Guide

This guide will help you set up and run the Event Zen application, which includes multiple microservices, databases, and a frontend.

## Prerequisites

- Docker and Docker Compose (latest version recommended)
- Git
- Java 17 (for local development)
- Node.js 16+ (for local frontend development)

## Project Structure

- `backend/` - Contains all microservices
  - `auth-service/` - Authentication and user management
  - `event-service/` - Event management
  - `budget-service/` - Budget management
  - `vendor-service/` - Vendor management
  - `venue-service/` - Venue management
- `frontend/` - React frontend application
- `scripts/` - Setup and utility scripts
- `docker-compose.yml` - Docker Compose configuration for all services

## Quick Start

1. Clone the repository:

   ```
   git clone [repository-url]
   cd event-zen
   ```

2. Initialize database scripts:

   ```
   ./scripts/init-db.sh
   ```

3. Start all services:

   ```
   ./scripts/run-services.sh
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend APIs (Swagger UI):
     - Auth Service: http://localhost:8081/api/swagger-ui.html
     - Event Service: http://localhost:8082/api/swagger-ui.html
     - Budget Service: http://localhost:8083/api/swagger-ui.html
     - Vendor Service: http://localhost:8084/api/swagger-ui.html
     - Venue Service: http://localhost:8085/api/swagger-ui.html

## Accessing Databases

The following PostgreSQL databases are available:

- Auth DB: `jdbc:postgresql://localhost:5432/auth_service` (username: eventzen, password: eventzen123)
- Event DB: `jdbc:postgresql://localhost:5433/event_service` (username: eventzen, password: eventzen123)
- Budget DB: `jdbc:postgresql://localhost:5434/budget_service` (username: eventzen, password: eventzen123)
- Vendor DB: `jdbc:postgresql://localhost:5435/vendor_service` (username: eventzen, password: eventzen123)
- Venue DB: `jdbc:postgresql://localhost:5436/venue_service` (username: eventzen, password: eventzen123)

## Test Users

The application comes with pre-configured test users:

- Admin User:

  - Email: admin@eventzen.com
  - Password: password123
  - Role: ADMIN

- Event Organizer:

  - Email: organizer@eventzen.com
  - Password: password123
  - Role: ORGANIZER

- Regular User:
  - Email: user@eventzen.com
  - Password: password123
  - Role: USER

## Developing Locally

### Backend Services

Each service can be developed independently using:

```
cd backend/[service-name]
./mvnw spring-boot:run
```

### Frontend

The frontend can be run separately in development mode:

```
cd frontend
npm install
npm start
```

## Troubleshooting

- **Service not starting:** Check logs with `docker-compose logs [service-name]`
- **Database connection issues:** Ensure database containers are healthy with `docker-compose ps`
- **API not responding:** Verify that the required dependent services are running

## Stopping the Application

To stop all services:

```
docker-compose down
```

To stop and remove all data (including database volumes):

```
docker-compose down -v
```
