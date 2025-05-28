#!/bin/bash

# Exit on error
set -e

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# Run security audit fix
echo "Running security audit..."
npm audit fix

# Run tests
echo "Running tests..."
npm run test

# Build the application
echo "Building application..."
npm run build

# Start the application
echo "Starting application..."
npm start 