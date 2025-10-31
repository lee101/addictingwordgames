#!/bin/bash

# Self-hosted startup script for Addicting Word Games

set -e

echo "Starting Addicting Word Games (self-hosted)..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "Please edit .env with your configuration"
fi

# Build and start services
echo "Building Docker images..."
docker-compose build

echo "Starting services..."
docker-compose up -d

echo ""
echo "Services started!"
echo "App available at: http://localhost:8080"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f       - View logs"
echo "  docker-compose down          - Stop services"
echo "  docker-compose restart       - Restart services"
echo "  docker-compose ps            - Check status"
