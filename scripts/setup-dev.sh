#!/bin/bash

# Setup Development Environment for Meilisearch MCP Server

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
  echo "Done! Please edit .env file with your Meilisearch configuration."
else
  echo ".env file already exists."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Run tests
echo "Running tests..."
if npm test; then
  echo "All tests passed!"
else
  echo "Warning: Some tests failed. You may need to fix them before proceeding."
  echo "You can continue with development, but be aware that some functionality may not work as expected."
fi

echo "Development environment setup complete!"
echo "To start the server in development mode, run: npm run dev" 
