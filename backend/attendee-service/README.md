# Attendee Service

This service is responsible for managing attendees and event registrations in the Event Zen platform.

## Features

- Attendee management (create, read, update, delete)
- Registration management for events
- Check-in functionality for event attendees
- Payment status tracking
- Reporting and analytics on attendee data

## Technology Stack

- Java 17
- Spring Boot 3.1
- MongoDB for data storage
- RESTful API design
- OpenAPI/Swagger documentation

## API Endpoints

The service exposes the following key API endpoints:

### Attendee Endpoints

- `GET /api/attendees`: Get a paginated list of all attendees
- `GET /api/attendees/{id}`: Get attendee by ID
- `GET /api/attendees/user/{userId}`: Get attendee by user ID
- `GET /api/attendees/event/{eventId}`: Get attendees for a specific event
- `POST /api/attendees`: Create a new attendee
- `PUT /api/attendees/{id}`: Update an existing attendee
- `PATCH /api/attendees/{id}/status`: Update attendee status
- `DELETE /api/attendees/{id}`: Delete an attendee

### Registration Endpoints

- `GET /api/registrations`: Get a paginated list of all registrations
- `GET /api/registrations/{id}`: Get registration by ID
- `GET /api/registrations/attendee/{attendeeId}`: Get registrations for a specific attendee
- `GET /api/registrations/event/{eventId}`: Get registrations for a specific event
- `POST /api/registrations`: Create a new registration
- `PUT /api/registrations/{id}`: Update an existing registration
- `PATCH /api/registrations/{id}/payment-status`: Update payment status
- `PATCH /api/registrations/{id}/check-in`: Check in an attendee
- `DELETE /api/registrations/{id}`: Delete a registration

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MongoDB 4.4 or higher

### Running Locally

1. Start MongoDB:

   ```
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. Build the application:

   ```
   mvn clean package
   ```

3. Run the application:
   ```
   java -jar target/attendee-service-0.0.1-SNAPSHOT.jar
   ```

### Using Docker

```
docker build -t event-zen/attendee-service .
docker run -p 8082:8082 event-zen/attendee-service
```

## API Documentation

Access the Swagger UI at:

```
http://localhost:8082/swagger-ui.html
```
