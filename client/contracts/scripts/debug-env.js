require("dotenv").config();

console.log("🔍 Debugging Environment Variables...");
console.log("");

console.log("📋 Environment Variables:");
console.log("   PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
console.log("   PRIVATE_KEY value:", process.env.PRIVATE_KEY ? `${process.env.PRIVATE_KEY.substring(0, 10)}...` : "undefined");
console.log("   PRIVATE_KEY length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 0);
console.log("   PRIVATE_KEY starts with 0x:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.startsWith('0x') : false);

console.log("");
console.log("🔧 Hardhat Configuration Test:");
console.log("   Expected format: 0x + 64 hex characters = 66 total characters");
console.log("   Your key length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 0);
console.log("   Is valid length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length === 66 : false);

if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here") {
  console.log("");
  console.log("✅ Private key appears to be set!");
  console.log("   First 10 chars:", process.env.PRIVATE_KEY.substring(0, 10));
  console.log("   Last 10 chars:", process.env.PRIVATE_KEY.substring(process.env.PRIVATE_KEY.length - 10));
} else {
  console.log("");
  console.log("❌ Private key is not properly set!");
  console.log("   Current value:", process.env.PRIVATE_KEY);
  console.log("");
  console.log("📝 To fix this:");
  console.log("   1. Open your .env file");
  console.log("   2. Find the line: PRIVATE_KEY=your_private_key_here");
  console.log("   3. Replace 'your_private_key_here' with your actual private key");
  console.log("   4. Private key should start with '0x' and be 66 characters long");
  console.log("   5. Save the file");
}

