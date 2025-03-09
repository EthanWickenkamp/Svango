#!/bin/bash

set -e

cd /app/myapp

echo "Cleaning up unwanted folders..."
# Remove any problematic folders
rm -rf /.svelte-kit
rm -rf /node_modules

echo "Installing dependencies..."
npm install

echo "Starting Svelte development server..."
exec npm run dev -- --host
