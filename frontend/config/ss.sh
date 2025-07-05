#!/bin/bash
set -e

cd /app/myapp

echo "Cleaning up old build..."
#rm -rf node_modules
rm -rf .svelte-kit
rm -rf build

echo "Installing only production dependencies..."
npm ci --omit=dev

echo "Syncing SvelteKit..."
npm run prepare

echo "Building for production..."
npm run build

echo "Starting production server..."
npm start