#!/bin/bash

set -e # exit on error

cd /app/myapp

# Remove existing package-lock and node_modules to force a fresh install
echo "Cleaning up old dependencies..."
rm -rf node_modules
rm -rf .svelte-kit
rm -rf build
#rm -f package-lock.json

echo "Installing dependencies..."
npm install

echo "Syncing SvelteKit..."
npm run prepare

echo "Starting Svelte development server..."
exec npm run dev -- --host
