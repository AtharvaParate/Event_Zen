# Backend Setup Guide for Event_Zen

This guide explains how to set up and connect to the backend services for the Event_Zen application.

## Overview

Event_Zen uses a microservices architecture with the following services:

1. **Auth Service** - User authentication and authorization (`PORT 8081`)
2. **Event Service** - Event management and ticketing (`PORT 8082`)
3. **Budget Service** - Budget management for events (`PORT 8083`)
4. **Vendor Service** - Vendor management (`PORT 8084`)
5. **Venue Service** - Venue management (`PORT 8085`)

## Setting Up the Backend Services

### Option 1: Using Docker Compose (Recommended)

The easiest way to run all the backend services is using Docker Compose:

```bash
# Navigate to the project root
cd /path/to/Event_Zen

# Start all services
docker-compose up
```

This will start all the required services with the correct port mappings and environment configurations.

### Option 2: Running Services Individually

If you prefer to run the services individually:

1. **Clone the Backend Repositories**

```bash
# Auth Service
git clone https://github.com/Event_Zen/auth-service.git
# Event Service
git clone https://github.com/Event_Zen/event-service.git
# Budget Service
git clone https://github.com/Event_Zen/budget-service.git
# Vendor Service
git clone https://github.com/Event_Zen/vendor-service.git
# Venue Service
git clone https://github.com/Event_Zen/venue-service.git
```

2. **Run Each Service**

For each service, follow these steps:

```bash
cd service-name
./mvnw spring-boot:run
```

## Connecting the Frontend to the Backend

The frontend connects to the backend services using environment variables. These are configured in:

- `.env.development` - For development (uses mock data by default)
- `.env.production` - For production (connects to real backend services)

### Development Mode

In development mode, you can:

1. **Use Mock Data**: Set `REACT_APP_USE_MOCK_DATA=true` in `.env.development`
2. **Connect to Local Backend**: Set the appropriate URLs and set `REACT_APP_USE_MOCK_DATA=false`

### Switching Between Mock and Real Data

To toggle between mock data and real backend:

1. Edit the `.env.development` file:

   ```
   # Use mock data
   REACT_APP_USE_MOCK_DATA=true

   # Use real backend
   REACT_APP_USE_MOCK_DATA=false
   ```

2. Restart the development server:
   ```bash
   npm run start
   ```

## API Documentation

Each service provides Swagger documentation at:

- Auth Service: http://localhost:8081/swagger-ui.html
- Event Service: http://localhost:8082/swagger-ui.html
- Budget Service: http://localhost:8083/swagger-ui.html
- Vendor Service: http://localhost:8084/swagger-ui.html
- Venue Service: http://localhost:8085/swagger-ui.html

## Troubleshooting

If you encounter connection issues:

1. Make sure all services are running and accessible on their respective ports
2. Check the console for CORS errors - you may need to configure CORS settings in the backend services
3. Verify that the environment variables are correctly set
4. Check for authentication issues - some endpoints require a valid JWT token

## Security Notes

For security reasons:

- Never commit `.env` files with real credentials to version control
- Use environment-specific variables for different environments
- Always use HTTPS in production environments
