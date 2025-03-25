# Contributing to EventZen

Thank you for considering contributing to EventZen! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

- Before creating a bug report, check the issue tracker to see if the problem has already been reported
- Use the bug report template when creating a new issue
- Include detailed steps to reproduce the bug
- Include screenshots if applicable
- Describe what behavior you expected to see

### Suggesting Enhancements

- Use the feature request template when suggesting enhancements
- Clearly describe the feature and its use case
- Explain why this enhancement would be useful to most users

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

Follow these steps to set up the project for local development:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/EventZen.git
   cd EventZen
   ```

2. Set up the frontend:

   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Set up the backend services as needed (refer to README.md for details)

## Style Guides

### JavaScript Style Guide

- We use ESLint for JavaScript code linting
- Run `npm run lint` to check for linting issues
- Run `npm run lint:fix` to automatically fix issues when possible

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Pull Request Guidelines

- Update the README.md with details of changes to the interface, if applicable
- Update the documentation when changing functionality
- The PR should work in all major browsers (Chrome, Firefox, Safari)
- Ensure all tests pass before submitting the PR

## Troubleshooting

### Known Issues

- **Material-UI Animation Errors**: See the "Troubleshooting Common Issues" section in README.md
- **Missing Index.html**: Ensure the file exists in the public directory
- **Build Errors**: Make sure all dependencies are installed correctly

## Additional Resources

- [Project README](README.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Issue Templates](.github/ISSUE_TEMPLATE/)
