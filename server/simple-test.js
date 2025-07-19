import fetch from 'node-fetch';

async function simpleTest() {
  console.log('Testing basic server connectivity...\n');

  try {
    // Test 1: Basic server response
    console.log('1. Testing basic server response...');
    const response = await fetch('http://localhost:5000/');
    
    if (response.ok) {
      const text = await response.text();
      console.log('✅ Server is responding');
      console.log(`   Response: ${text}`);
    } else {
      console.log('❌ Server not responding');
      console.log(`   Status: ${response.status}`);
    }

    // Test 2: Trust score endpoint
    console.log('\n2. Testing trust score endpoint...');
    const trustResponse = await fetch('http://localhost:5000/api/trust-score/test-file');
    
    if (trustResponse.ok) {
      const trustData = await trustResponse.json();
      console.log('✅ Trust score endpoint working');
      console.log(`   Trust Score: ${Math.round(trustData.data.trustScore * 100)}%`);
    } else {
      console.log('❌ Trust score endpoint failed');
      console.log(`   Status: ${trustResponse.status}`);
      const errorText = await trustResponse.text();
      console.log(`   Error: ${errorText}`);
    }

    // Test 3: Files endpoint
    console.log('\n3. Testing files endpoint...');
    const filesResponse = await fetch('http://localhost:5000/api/files');
    
    if (filesResponse.ok) {
      const filesData = await filesResponse.json();
      console.log('✅ Files endpoint working');
      console.log(`   Files count: ${filesData.data.files.length}`);
    } else {
      console.log('❌ Files endpoint failed');
      console.log(`   Status: ${filesResponse.status}`);
      const errorText = await filesResponse.text();
      console.log(`   Error: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('This might indicate the server is not running on port 5000');
  }
}

simpleTest(); 