# EventZen - Event Management System

EventZen is a comprehensive event management system designed to streamline event planning operations, improve efficiency, and enhance customer experience.

## Project Overview

EventZen is a full-stack web application built with:

- Frontend: React.js
- Backend: Spring Boot & Node.js (Microservices Architecture)
- Database: PostgreSQL
- Authentication: JWT
- Containerization: Docker

## Features

### 1. User Management Module

- User registration and authentication
- JWT-based secure login
- User profile management
- Role-based access control

### 2. Event Management Module

- Event creation and scheduling
- Venue booking management
- Vendor coordination
- Event status tracking
- Event analytics

### 3. Attendee Management Module

- Attendee registration
- Guest list management
- Automated email notifications
- Attendance tracking
- Feedback collection

### 4. Budget Management Module

- Budget planning and tracking
- Expense management
- Financial reporting
- Invoice generation
- Payment tracking

## Project Structure

```
eventzen/
├── frontend/                 # React frontend application
├── backend/
│   ├── auth-service/        # Authentication microservice (Node.js)
│   ├── event-service/       # Event management microservice (Spring Boot)
│   ├── attendee-service/    # Attendee management microservice (Spring Boot)
│   └── budget-service/      # Budget management microservice (Spring Boot)
├── docker/                  # Docker configuration files
└── docs/                    # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Java 17
- Docker and Docker Compose
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/eventzen.git
cd eventzen
```

2. Start the application using Docker Compose:

```bash
docker-compose up -d
```

3. Access the application:

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080

## Documentation

Detailed documentation including:

- API Endpoints
- Database Schema
- User Flow Diagrams
- Wireframe Designs
- ER Diagrams

can be found in the `docs/` directory.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
