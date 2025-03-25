# EventZen - Event Management System

EventZen is a comprehensive event management platform designed to streamline the process of organizing, managing, and attending events.

## Features

- User authentication with JWT
- Event creation and management
- Vendor management for events
- Role-based authorization (Admin, Organizer, Attendee)
- RESTful API with Spring Boot
- MongoDB for data persistence
- Frontend with React.js
- Docker containerization

## Project Structure

The project follows a microservices architecture with the following components:

```
EventZen/
├── backend/
│   ├── event-service/      # Spring Boot service for event management
│   ├── auth-service/       # Node.js service for authentication
│   ├── attendee-service/   # Service for attendee management
│   └── budget-service/     # Service for budget management
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

### Running with Docker

1. Clone the repository:

```bash
git clone https://github.com/yourusername/EventZen.git
cd EventZen
```

2. Build and run using Docker Compose:

```bash
docker-compose up --build
```

3. Access the application at:
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8080/api/swagger-ui.html

### Development Setup

To set up the development environment:

1. Event Service (Spring Boot):

```bash
cd backend/event-service
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

2. Auth Service (Node.js):

```bash
cd backend/auth-service
npm install
npm run dev
```

3. Frontend (React):

```bash
cd frontend
npm install
npm start
```

## API Documentation

API documentation is available via Swagger UI at:

- http://localhost:8080/api/swagger-ui.html

## Authentication

The application uses JWT-based authentication. See the [Authentication Documentation](docs/authentication/README.md) for details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Documentation

Additional documentation can be found in the `docs` directory:

- [Authentication](docs/authentication/README.md)
- [Event API](docs/event-api/README.md)
- [Vendor API](docs/vendor-api/README.md)
- [Deployment Guide](docs/deployment/README.md)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
