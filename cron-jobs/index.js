require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');
const winston = require('winston');
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mintellect-cron-jobs' },
  transports: [
    new winston.transports.File({ 
      filename: process.env.LOG_FILE || path.join(logsDir, 'cron-jobs.log') 
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// API Configuration
const API_CONFIG = {
  plagiarism: {
    url: process.env.PLAGIARISM_API_URL || 'https://mintellect-bnb-plagiarism.onrender.com',
    endpoint: process.env.PLAGIARISM_HEALTH_ENDPOINT || '/',
    name: 'Plagiarism API'
  },
  main: {
    url: process.env.MAIN_API_URL || 'https://api.mintellect.xyz',
    endpoint: process.env.MAIN_API_HEALTH_ENDPOINT || '/',
    name: 'Main API'
  }
};

// Request configuration
const REQUEST_CONFIG = {
  timeout: parseInt(process.env.REQUEST_TIMEOUT) || 10000,
  maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
  retryDelay: parseInt(process.env.RETRY_DELAY) || 5000
};

/**
 * Make HTTP request to API with retry logic
 */
async function makeRequest(apiConfig, retryCount = 0) {
  const fullUrl = `${apiConfig.url}${apiConfig.endpoint}`;
  
  try {
    logger.info(`Making request to ${apiConfig.name}: ${fullUrl}`);
    
    const response = await axios.get(fullUrl, {
      timeout: REQUEST_CONFIG.timeout,
      headers: {
        'User-Agent': 'Mintellect-Cron-Job/1.0',
        'Accept': 'application/json'
      }
    });
    
    logger.info(`${apiConfig.name} - Status: ${response.status}, Response time: ${response.headers['x-response-time'] || 'N/A'}ms`);
    
    return {
      success: true,
      status: response.status,
      responseTime: Date.now(),
      data: response.data
    };
    
  } catch (error) {
    const errorMessage = error.response 
      ? `${error.response.status}: ${error.response.statusText}`
      : error.message;
    
    logger.error(`${apiConfig.name} - Request failed: ${errorMessage}`);
    
    // Retry logic
    if (retryCount < REQUEST_CONFIG.maxRetries) {
      logger.info(`Retrying ${apiConfig.name} in ${REQUEST_CONFIG.retryDelay}ms (attempt ${retryCount + 1}/${REQUEST_CONFIG.maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, REQUEST_CONFIG.retryDelay));
      return makeRequest(apiConfig, retryCount + 1);
    }
    
    return {
      success: false,
      error: errorMessage,
      retryCount,
      timestamp: Date.now()
    };
  }
}

/**
 * Execute health checks for all APIs
 */
async function executeHealthChecks() {
  logger.info('Starting API health checks...');
  const startTime = Date.now();
  
  const results = {};
  
  // Check Plagiarism API
  results.plagiarism = await makeRequest(API_CONFIG.plagiarism);
  
  // Check Main API
  results.main = await makeRequest(API_CONFIG.main);
  
  const totalTime = Date.now() - startTime;
  
  // Log summary
  const successCount = Object.values(results).filter(r => r.success).length;
  const totalCount = Object.keys(results).length;
  
  logger.info(`Health checks completed in ${totalTime}ms. Success: ${successCount}/${totalCount}`);
  
  // Log detailed results
  Object.entries(results).forEach(([apiName, result]) => {
    if (result.success) {
      logger.info(`${apiName}: ✅ Success (${result.status})`);
    } else {
      logger.error(`${apiName}: ❌ Failed - ${result.error}`);
    }
  });
  
  return results;
}

/**
 * Main cron job function
 */
function runCronJob() {
  logger.info('🕐 Cron job triggered - executing API health checks');
  
  executeHealthChecks()
    .then(() => {
      logger.info('✅ Cron job completed successfully');
    })
    .catch((error) => {
      logger.error('❌ Cron job failed:', error);
    });
}

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (for Render)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Mintellect Cron Jobs',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cronSchedule: process.env.CRON_SCHEDULE || '*/14 * * * *'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Mintellect Cron Jobs Service',
    description: 'Automated health checks for Mintellect APIs',
    endpoints: {
      health: '/health',
      status: '/status',
      test: '/test'
    },
    cronSchedule: process.env.CRON_SCHEDULE || '*/14 * * * *',
    apis: {
      plagiarism: API_CONFIG.plagiarism.url,
      main: API_CONFIG.main.url
    }
  });
});

// Status endpoint
app.get('/status', async (req, res) => {
  try {
    const results = await executeHealthChecks();
    res.json({
      timestamp: new Date().toISOString(),
      results,
      summary: {
        total: Object.keys(results).length,
        success: Object.values(results).filter(r => r.success).length,
        failed: Object.values(results).filter(r => !r.success).length
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get status',
      message: error.message
    });
  }
});

// Test endpoint (manual trigger)
app.post('/test', async (req, res) => {
  try {
    logger.info('🧪 Manual test triggered via API endpoint');
    const results = await executeHealthChecks();
    res.json({
      message: 'Manual test completed',
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    res.status(500).json({
      error: 'Test failed',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Express error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: ['/', '/health', '/status', '/test']
  });
});

// Schedule cron job to run every 14 minutes
const cronSchedule = process.env.CRON_SCHEDULE || '*/14 * * * *';

// Start the Express server
app.listen(PORT, () => {
  logger.info(`🚀 Mintellect Cron Jobs Web Service started on port ${PORT}`);
  logger.info(`📅 Cron Schedule: ${cronSchedule}`);
  logger.info(`🔗 APIs to monitor:`);
  logger.info(`   - ${API_CONFIG.plagiarism.name}: ${API_CONFIG.plagiarism.url}`);
  logger.info(`   - ${API_CONFIG.main.name}: ${API_CONFIG.main.url}`);
  logger.info(`⏱️  Request timeout: ${REQUEST_CONFIG.timeout}ms`);
  logger.info(`🔄 Max retries: ${REQUEST_CONFIG.maxRetries}`);
  logger.info(`🌐 Web endpoints available:`);
  logger.info(`   - Health check: http://localhost:${PORT}/health`);
  logger.info(`   - Status: http://localhost:${PORT}/status`);
  logger.info(`   - Manual test: http://localhost:${PORT}/test`);
  
  // Start the cron job after server is running
  logger.info('🔍 Starting cron job scheduler...');
  const cronJob = cron.schedule(cronSchedule, runCronJob, {
    scheduled: true,
    timezone: "UTC"
  });
  
  // Run initial health check on startup
  logger.info('🔍 Running initial health check...');
  executeHealthChecks()
    .then(() => {
      logger.info('✅ Initial health check completed');
    })
    .catch((error) => {
      logger.error('❌ Initial health check failed:', error);
    });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    logger.info('🛑 Received SIGINT, shutting down gracefully...');
    cronJob.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    logger.info('🛑 Received SIGTERM, shutting down gracefully...');
    cronJob.stop();
    process.exit(0);
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('💥 Uncaught Exception:', error);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
  
  logger.info('🎯 Cron job system is now running and monitoring your APIs every 14 minutes!');
  logger.info('🌐 Web service is ready to respond to requests!');
});
