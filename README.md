# EventZen - Event Management System

EventZen is a comprehensive event management platform designed to streamline the process of organizing, managing, and attending events.

## Features

- User authentication with JWT
- Event creation and management
- Vendor management for events
- Role-based authorization (Admin, Organizer, Attendee)
- RESTful API with Spring Boot
- MongoDB and PostgreSQL for data persistence
- Frontend with React.js
- Docker containerization
- Attendee registration and check-in

## Project Structure

The project follows a microservices architecture with the following components:

```
EventZen/
├── backend/
│   ├── event-service/      # Spring Boot service for event management
│   ├── auth-service/       # Authentication service
│   ├── attendee-service/   # Service for attendee management
│   ├── budget-service/     # Service for budget management
│   ├── vendor-service/     # Service for vendor management
│   └── venue-service/      # Service for venue management
├── frontend/              # React frontend application
├── docker/                # Docker configuration files
└── docs/                 # Project documentation
```

## Getting Started

### Prerequisites

- Java 17
- Node.js 18+
- Docker and Docker Compose
- MongoDB
- PostgreSQL

### Quick Start (with Docker)

The easiest way to run the complete EventZen application:

1. Clone the repository:

```bash
git clone https://github.com/AtharvaParate/EventZen.git
cd EventZen
```

2. Start all services with Docker Compose:

```bash
docker-compose up --build
```

3. Access the application at:
   - Frontend: http://localhost:3000
   - Backend Services:
     - API Gateway: http://localhost:8080
     - Auth Service: http://localhost:8084
     - Event Service: http://localhost:8081
     - Budget Service: http://localhost:8083
     - Attendee Service: http://localhost:8082

### Starting Individual Components

#### Frontend

```bash
cd frontend
npm install
npm start
```

The React frontend will be available at http://localhost:3000

#### Backend Services

Each service can be started individually:

```bash
cd backend/service-name
./mvnw spring-boot:run
```

Or use the provided scripts to start all services:

```bash
./start-services.sh
```

#### Databases

The application uses PostgreSQL for relational data and MongoDB for document storage:

```bash
# Initialize and start all databases
./setup-databases.sh
```

Or manually start databases with Docker:

```bash
docker-compose up -d postgres mongodb
```

## Configuration

### Mock Data vs. Real Data

The frontend can operate with mock data or connect to real backend services:

- **Using Mock Data**: Set `USE_MOCK_DATA: true` in `frontend/src/config/apiConfig.js`
- **Using Real Backend**: Set `USE_MOCK_DATA: false` and ensure backend services are running

### Environment Variables

Key environment variables for connecting services:

```
# Frontend
REACT_APP_API_URL=http://localhost:8080/api

# Backend Services
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/eventzen
SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/eventzen
JWT_SECRET=your-secret-key
```

## Recent Updates and Bug Fixes

### 1. Registration and Event Display Fixes (April 2024)

- Fixed issue where registrations were showing "Unknown Event" in the registrations page
- Enhanced event data association when creating and updating registrations
- Improved data consistency between mock events and registration data
- Added proper error handling and CORS configurations for API instances
- Fixed event information display in registration cards

These changes ensure proper display of event names in registration cards and maintain data integrity across operations like create, update, and check-in.

### 2. API Integration (April 2024)

- Added proper Axios instance configuration for all services
- Implemented consistent error handling across all API calls
- Added authentication interceptors for secure API access
- Configured cross-origin resource sharing (CORS) for all API endpoints

## Troubleshooting Common Issues

### Connection Issues

If you encounter connection issues between services:

1. Ensure all required services are running - check with `docker-compose ps`
2. Verify network configurations in `docker-compose.yml`
3. Check CORS settings if browser shows cross-origin errors
4. Make sure ports are not already in use (use `./free-ports.sh` to check)

### Authentication Problems

For authentication issues:

1. Check that the auth-service is running and accessible
2. Verify JWT token validity and expiration
3. Ensure proper authorization headers are being sent with requests

### Docker-related Issues

If facing problems with Docker:

1. Try stopping all containers and volumes: `docker-compose down -v`
2. Rebuild containers: `docker-compose build --no-cache`
3. Start services one by one to identify problematic containers

## Documentation

Additional documentation:

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Backend Setup](BACKEND_SETUP.md) - Specific backend configuration
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
