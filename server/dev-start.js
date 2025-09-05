#!/usr/bin/env node

// Development startup script
process.env.NODE_ENV = 'development';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Start the server
import './server.js';
