#!/bin/bash

set -e #exit on error

cd /app/myapp

# Remove existing package-lock and node_modules to force a fresh install
echo "Cleaning up old dependencies..."
rm -rf node_modules
rm -rf .svelte-kit
#rm -f package-lock.json

echo "Installing dependencies..."
npm install

echo "force re-optimize"
npx vite --force  # Triggers Vite to rebuild deps

echo "Starting Svelte development server..."
exec npm run dev -- --host
#exec npm run build
