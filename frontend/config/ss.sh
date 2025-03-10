#!/bin/bash

set -e

cd /app/myapp

# Remove existing package-lock and node_modules to force a fresh install
rm -f package-lock.json
rm -rf node_modules

echo "Installing dependencies..."
npm install

echo "Starting Svelte development server..."
exec npm run dev -- --host
