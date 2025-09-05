#!/bin/bash

# Render build script for Mintellect server
echo "Starting Render build process..."

# Install system dependencies
echo "Installing system dependencies..."
apt-get update
apt-get install -y wget gnupg

# Add Google Chrome repository
echo "Adding Google Chrome repository..."
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Install Chrome
echo "Installing Google Chrome..."
apt-get update
apt-get install -y google-chrome-stable

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install --force

# Install Puppeteer Chrome
echo "Installing Puppeteer Chrome..."
npx puppeteer browsers install chrome

echo "Build process completed!"
