#!/usr/bin/env node

// Test script for health endpoints
const https = require('https');
const http = require('http');

// Base64 encode credentials
const credentials = Buffer.from('cronjob@mintellect:mintellect2025').toString('base64');

const testHealthEndpoint = (url, name) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'Mintellect-Health-Check/1.0'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ ${name}: ${response.status}`);
          console.log(`   Timestamp: ${response.timestamp}`);
          console.log(`   Uptime: ${Math.round(response.uptime)}s`);
          resolve(response);
        } catch (error) {
          console.log(`❌ ${name}: Invalid JSON response`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response: ${data}`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${name}: Connection failed`);
      console.log(`   Error: ${error.message}`);
      reject(error);
    });

    req.setTimeout(10000, () => {
      console.log(`❌ ${name}: Request timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
};

// Test endpoints
const endpoints = [
  { url: 'https://api.mintellect.xyz/health', name: 'Main API Server' },
  { url: 'https://mintellect-bnb-plagiarism.onrender.com/health', name: 'Plagiarism Server' }
];

async function runTests() {
  console.log('🔍 Testing Mintellect Health Endpoints...\n');
  
  for (const endpoint of endpoints) {
    try {
      await testHealthEndpoint(endpoint.url, endpoint.name);
    } catch (error) {
      console.log(`   Error: ${error.message}\n`);
    }
  }
  
  console.log('\n📋 Cronjobs.org Setup Instructions:');
  console.log('1. Go to https://cronjobs.org');
  console.log('2. Create a new cron job');
  console.log('3. Set URL to: https://api.mintellect.xyz/health');
  console.log('4. Set HTTP Authentication:');
  console.log('   Username: cronjob@mintellect');
  console.log('   Password: mintellect2025');
  console.log('5. Set schedule (e.g., every 14 minutes): */14 * * * *');
  console.log('6. Repeat for plagiarism server: https://mintellect-bnb-plagiarism.onrender.com/health');
}

runTests().catch(console.error);
