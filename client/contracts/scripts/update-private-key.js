const fs = require('fs');
const path = require('path');

console.log("🔧 Updating Private Key in .env file...");
console.log("");

const envPath = path.join(__dirname, '..', '.env');

// Your private key from MetaMask
const newPrivateKey = 'af0e3c0f38439b5347fdf62b609f1cbcfa2b892a9a4d34da14cf2e8729dda421';

console.log("📋 Private Key Details:");
console.log("   Length:", newPrivateKey.length);
console.log("   Starts with 0x:", newPrivateKey.startsWith('0x'));
console.log("   Needs 0x prefix:", !newPrivateKey.startsWith('0x'));

// Read current .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Replace the PRIVATE_KEY line
const updatedContent = envContent.replace(
  /^PRIVATE_KEY=.*$/m, 
  `PRIVATE_KEY=${newPrivateKey}`
);

// Write the updated content back to the file
fs.writeFileSync(envPath, updatedContent);

console.log("✅ Updated .env file with your private key");
console.log("");

// Now add the 0x prefix if needed
if (!newPrivateKey.startsWith('0x')) {
  console.log("🔧 Adding 0x prefix...");
  
  const privateKeyWithPrefix = '0x' + newPrivateKey;
  const finalContent = updatedContent.replace(
    /^PRIVATE_KEY=.*$/m, 
    `PRIVATE_KEY=${privateKeyWithPrefix}`
  );
  
  fs.writeFileSync(envPath, finalContent);
  
  console.log("✅ Added 0x prefix");
  console.log("   Final private key length:", privateKeyWithPrefix.length);
  console.log("   Should be 66 characters: ✅");
} else {
  console.log("✅ Private key already has 0x prefix");
}

console.log("");
console.log("🧪 Testing the updated private key...");

// Test the updated private key
require('dotenv').config({ override: true });

const testPrivateKey = process.env.PRIVATE_KEY;
console.log("   Length:", testPrivateKey ? testPrivateKey.length : 0);
console.log("   Starts with 0x:", testPrivateKey ? testPrivateKey.startsWith('0x') : false);
console.log("   Is valid length:", testPrivateKey ? testPrivateKey.length === 66 : false);

if (testPrivateKey && testPrivateKey.length === 66 && testPrivateKey.startsWith('0x')) {
  console.log("");
  console.log("🎉 Private key is now properly formatted!");
  console.log("📝 You can now run:");
  console.log("   npm run verify:network");
  console.log("   npm run deploy");
} else {
  console.log("");
  console.log("❌ Private key format is still incorrect");
  console.log("   Expected: 0x + 64 hex characters = 66 total characters");
  console.log("   Current length:", testPrivateKey ? testPrivateKey.length : 0);
}

