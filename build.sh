#!/bin/bash

# EventZen Build Script for Production Deployment
# This script prepares the application for production deployment

echo "🚀 Starting EventZen build process..."

# Run image directory check
echo "🖼️ Checking image directories..."
./checkImageDirs.sh

if [ $? -ne 0 ]; then
  echo "❌ Image directory check failed!"
  exit 1
fi

# Navigate to frontend directory
cd frontend

echo "📦 Installing frontend dependencies..."
npm install

echo "🧪 Running linter checks..."
npm run lint --if-present

echo "🔨 Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Frontend build completed successfully!"
else
  echo "❌ Frontend build failed!"
  exit 1
fi

# Navigate back to root
cd ..

# Check if docker is available
if command -v docker &> /dev/null; then
  echo "🐳 Building Docker images..."
  docker-compose build

  echo "🧪 Running Docker validation..."
  docker-compose config

  if [ $? -eq 0 ]; then
    echo "✅ Docker configuration is valid!"
  else
    echo "❌ Docker configuration is invalid!"
    exit 1
  fi
else
  echo "⚠️ Docker not found. Skipping Docker build steps."
fi

echo "🎉 Build process completed successfully!"
echo "To deploy:"
echo "  1. Copy the 'frontend/build' directory to your web server"
echo "  2. Configure your server's environment variables"
echo "  3. For Docker deployment, run 'docker-compose up -d'"

exit 0 