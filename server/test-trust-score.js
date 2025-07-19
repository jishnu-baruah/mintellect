import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001';

async function testTrustScore() {
  console.log('Testing Trust Score API...\n');

  try {
    // Test 1: Generate trust score
    console.log('1. Testing trust score generation...');
    const generateResponse = await fetch(`${BASE_URL}/api/trust-score/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        textContent: 'This is a sample academic document for testing trust score calculation. The document contains proper citations and follows academic writing standards.',
        plagiarismResults: {
          plagiarism: {
            overall_score: 15
          }
        },
        fileId: 'test-file-123'
      })
    });

    if (generateResponse.ok) {
      const generateData = await generateResponse.json();
      console.log('✅ Trust score generation successful');
      console.log(`   Trust Score: ${generateData.data.trustScore}%`);
      console.log(`   Plagiarism Score: ${generateData.data.plagiarismScore}%`);
      console.log(`   AI Classification: ${generateData.data.aiAnalysis.classification}`);
      console.log(`   Confidence: ${Math.round(generateData.data.aiAnalysis.confidence * 100)}%`);
    } else {
      console.log('❌ Trust score generation failed');
      const error = await generateResponse.text();
      console.log(`   Error: ${error}`);
    }

    // Test 2: Get trust score for a file
    console.log('\n2. Testing trust score retrieval...');
    const getResponse = await fetch(`${BASE_URL}/api/trust-score/test-file-123`);

    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('✅ Trust score retrieval successful');
      console.log(`   Trust Score: ${Math.round(getData.data.trustScore * 100)}%`);
      console.log(`   Similarity: ${Math.round(getData.data.similarity * 100)}%`);
    } else {
      console.log('❌ Trust score retrieval failed');
      const error = await getResponse.text();
      console.log(`   Error: ${error}`);
    }

    // Test 3: File upload and trust score
    console.log('\n3. Testing file upload and trust score...');
    const uploadResponse = await fetch(`${BASE_URL}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: new FormData()
    });

    if (uploadResponse.ok) {
      const uploadData = await uploadResponse.json();
      console.log('✅ File upload successful');
      console.log(`   File ID: ${uploadData.data.fileId}`);
      
      // Test trust score for uploaded file
      const fileTrustResponse = await fetch(`${BASE_URL}/api/files/${uploadData.data.fileId}/trust-score`);
      if (fileTrustResponse.ok) {
        const fileTrustData = await fileTrustResponse.json();
        console.log('✅ File trust score successful');
        console.log(`   Trust Score: ${Math.round(fileTrustData.data.trustScore * 100)}%`);
      } else {
        console.log('❌ File trust score failed');
      }
    } else {
      console.log('❌ File upload failed');
      const error = await uploadResponse.text();
      console.log(`   Error: ${error}`);
    }

    // Test 4: Plagiarism check
    console.log('\n4. Testing plagiarism check...');
    const plagiarismResponse = await fetch(`${BASE_URL}/api/files/test-file-123/check-plagiarism`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (plagiarismResponse.ok) {
      const plagiarismData = await plagiarismResponse.json();
      console.log('✅ Plagiarism check successful');
      console.log(`   Status: ${plagiarismData.data.status}`);
      console.log(`   Plagiarism Score: ${plagiarismData.data.results.plagiarism.overall_score}%`);
    } else {
      console.log('❌ Plagiarism check failed');
      const error = await plagiarismResponse.text();
      console.log(`   Error: ${error}`);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testTrustScore(); 