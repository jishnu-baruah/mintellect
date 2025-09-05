#!/bin/bash

# Render build script for Mintellect server
echo "Starting Render build process..."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install --force

# Install Puppeteer Chrome
echo "Installing Puppeteer Chrome..."
npx puppeteer browsers install chrome

echo "Build process completed!"
