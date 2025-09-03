require('dotenv').config();
const axios = require('axios');

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

/**
 * Test a single API endpoint
 */
async function testAPI(apiConfig) {
  const fullUrl = `${apiConfig.url}${apiConfig.endpoint}`;
  
  console.log(`\n🔍 Testing ${apiConfig.name}...`);
  console.log(`📍 URL: ${fullUrl}`);
  
  try {
    const startTime = Date.now();
    
    const response = await axios.get(fullUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mintellect-API-Test/1.0',
        'Accept': 'application/json'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log(`✅ ${apiConfig.name} - SUCCESS`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Response Time: ${responseTime}ms`);
    console.log(`   Content Type: ${response.headers['content-type'] || 'N/A'}`);
    
    if (response.data) {
      console.log(`   Response Size: ${JSON.stringify(response.data).length} characters`);
    }
    
    return { success: true, status: response.status, responseTime };
    
  } catch (error) {
    console.log(`❌ ${apiConfig.name} - FAILED`);
    
    if (error.response) {
      console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
      console.log(`   Error: ${error.response.data || 'No error details'}`);
    } else if (error.request) {
      console.log(`   Error: No response received (timeout or network issue)`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    
    return { success: false, error: error.message };
  }
}

/**
 * Test all APIs
 */
async function testAllAPIs() {
  console.log('🚀 Starting API Health Check Test...\n');
  console.log('=' .repeat(60));
  
  const results = {};
  
  // Test Plagiarism API
  results.plagiarism = await testAPI(API_CONFIG.plagiarism);
  
  // Test Main API
  results.main = await testAPI(API_CONFIG.main);
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS SUMMARY:');
  console.log('=' .repeat(60));
  
  Object.entries(results).forEach(([apiName, result]) => {
    if (result.success) {
      console.log(`✅ ${apiName}: SUCCESS (${result.status}) - ${result.responseTime}ms`);
    } else {
      console.log(`❌ ${apiName}: FAILED - ${result.error}`);
    }
  });
  
  const successCount = Object.values(results).filter(r => r.success).length;
  const totalCount = Object.keys(results).length;
  
  console.log('\n' + '=' .repeat(60));
  console.log(`🎯 Overall Result: ${successCount}/${totalCount} APIs are responding`);
  
  if (successCount === totalCount) {
    console.log('🎉 All APIs are healthy!');
  } else {
    console.log('⚠️  Some APIs need attention.');
  }
  
  console.log('=' .repeat(60));
}

// Run the test
if (require.main === module) {
  testAllAPIs()
    .then(() => {
      console.log('\n✨ API testing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed with error:', error);
      process.exit(1);
    });
}

module.exports = { testAPI, testAllAPIs };
