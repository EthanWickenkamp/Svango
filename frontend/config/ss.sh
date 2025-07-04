#!/bin/bash

set -e

cd /app/myapp

# Remove existing build artifacts to force a fresh build
echo "Cleaning up old build..."
rm -rf node_modules
rm -rf .svelte-kit
rm -rf build

echo "Installing dependencies..."
npm install

# Run svelte-kit sync to generate .svelte-kit directory
echo "Syncing SvelteKit..."
npm run prepare

# Debug: Check project structure
echo "Checking project structure..."
ls -la src/
ls -la src/routes/

# Debug: Check if .svelte-kit was created properly
echo "Checking .svelte-kit directory..."
ls -la .svelte-kit/

echo "Building for production..."
npm run build

echo "Starting production server..."
exec HOST=$FRONTEND_HOST PORT=$FRONTEND_PORT node build