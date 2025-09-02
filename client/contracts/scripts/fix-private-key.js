require("dotenv").config();
const fs = require('fs');
const path = require('path');

console.log("🔧 Fixing Private Key Format...");
console.log("");

const envPath = path.join(__dirname, '..', '.env');

// Read current .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Find the PRIVATE_KEY line
const privateKeyMatch = envContent.match(/^PRIVATE_KEY=(.*)$/m);

if (!privateKeyMatch) {
  console.log("❌ PRIVATE_KEY not found in .env file");
  process.exit(1);
}

let privateKey = privateKeyMatch[1].trim();

console.log("📋 Current Private Key:");
console.log("   Value:", privateKey.substring(0, 10) + "...");
console.log("   Length:", privateKey.length);
console.log("   Starts with 0x:", privateKey.startsWith('0x'));

// Check if it's the placeholder
if (privateKey === "your_private_key_here") {
  console.log("");
  console.log("❌ Private key is still the placeholder!");
  console.log("📝 Please replace 'your_private_key_here' with your actual private key from MetaMask");
  console.log("   Then run this script again to add the 0x prefix");
  process.exit(1);
}

// Add 0x prefix if missing
if (!privateKey.startsWith('0x')) {
  console.log("");
  console.log("🔧 Adding 0x prefix...");
  privateKey = '0x' + privateKey;
  
  // Update the .env file
  envContent = envContent.replace(/^PRIVATE_KEY=.*$/m, `PRIVATE_KEY=${privateKey}`);
  fs.writeFileSync(envPath, envContent);
  
  console.log("✅ Added 0x prefix to private key");
  console.log("   New length:", privateKey.length);
  console.log("   Should be 66 characters for valid private key");
} else {
  console.log("");
  console.log("✅ Private key already has 0x prefix");
}

console.log("");
console.log("🧪 Testing the fixed private key...");

// Test the fixed private key
require('dotenv').config({ override: true }); // Reload .env

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

