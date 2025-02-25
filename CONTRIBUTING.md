# Contributing to Meilisearch MCP Server

Thank you for your interest in contributing to the Meilisearch MCP Server! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/meilisearch-mcp.git`
3. Navigate to the project directory: `cd meilisearch-mcp`
4. Install dependencies: `npm install`
5. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes
2. Run the linter: `npm run lint`
3. Run tests: `npm test`
4. Build the project: `npm run build`
5. Test your changes with a local Meilisearch instance

## Pull Request Process

1. Ensure your code passes all tests and linting
2. Update documentation if necessary
3. Submit a pull request to the `main` branch
4. Describe your changes in detail in the pull request description
5. Reference any related issues

## Adding New Tools

When adding new tools to the MCP server:

1. Create a new file in the `src/tools` directory if appropriate
2. Follow the existing pattern for tool registration
3. Use Zod for parameter validation
4. Add proper error handling
5. Update the README.md to document the new tool

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Write tests for new functionality

## Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting a pull request
- Test with a real Meilisearch instance when possible

## Documentation

- Update the README.md file with any new features or changes
- Document all new tools and parameters
- Provide examples for complex functionality

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT license. 
