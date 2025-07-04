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

echo "Building for production..."
npm run build

echo "Starting production server..."
export HOST=${HOST}
export PORT=${PORT}
exec node build