# EventZen Event Service

This is the event management service for the EventZen application. It handles all event-related operations including creation, management, and vendor associations.

## Prerequisites

- Java 17 or later
- Maven 3.6 or later
- Docker and Docker Compose
- MongoDB (if running locally)

## Getting Started

### Local Development

1. Clone the repository
2. Navigate to the event-service directory
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Using Docker

1. Build and run the service using Docker Compose:
   ```bash
   docker-compose up --build
   ```

The service will be available at `http://localhost:8080/api`

## API Documentation

Once the service is running, you can access:

- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI Documentation: `http://localhost:8080/api/api-docs`

## Features

- Event CRUD operations
- Vendor management
- Event search and filtering
- Event status management
- Public and private event endpoints
- JWT-based authentication
- MongoDB integration
- Swagger/OpenAPI documentation

## Configuration

The application can be configured through `application.yml`. Key configurations include:

- MongoDB connection settings
- JWT settings
- Server port and context path
- Logging levels

## Testing

Run the tests using:

```bash
mvn test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
