# Changelog

All notable changes to the EventZen project will be documented in this file.

## [Unreleased]

## [0.3.0] - 2024-04-03

### Added

- Cross-Origin Resource Sharing (CORS) support to all API instances
- Authentication interceptors for secure API access
- Request and response error handling across all API calls
- Event data validation and preservation in registration workflow
- Detailed documentation for bug fixes and system startup

### Fixed

- Issue where registrations displayed "Unknown Event" in the UI
- Event data inconsistency between creation, updates, and check-in operations
- Event ID mismatch between mock events and registrations
- Data loading sequence optimized to ensure proper data relationships
- Dialog close logic to properly close after successful and failed operations

### Changed

- Updated README with comprehensive documentation for starting the system
- Improved configuration for mock data vs. real API data
- Enhanced UI components to better handle different data structures
- Modified Docker Compose configuration for better service integration

## [0.2.0] - 2024-03-25

### Added

- Budget management features
- Event creation and management
- User authentication with JWT
- Frontend components for event management

### Fixed

- Various UI rendering issues
- API endpoint configuration
- Authentication token handling

## [0.1.0] - 2024-03-10

### Added

- Initial project structure
- Basic microservices setup
- Docker configuration
- React frontend scaffold
