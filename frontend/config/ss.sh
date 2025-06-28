#!/bin/bash

set -e #exit on error

cd /app/myapp

# Remove existing build artifacts to force a fresh build
echo "Cleaning up old build..."
rm -rf node_modules
rm -rf .svelte-kit
rm -rf build
#rm -f package-lock.json

echo "Installing dependencies..."
npm install

echo "Building for production..."
npm run build

echo "Starting production server..."
exec node build