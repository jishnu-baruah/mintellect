// Test file for Pinata upload functionality
// Run with: node test-pinata.js

// Mock environment variable for testing
process.env.NEXT_PUBLIC_PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5MjdhZmEyMC0xN2E1LTRlMWYtOGE5YS03ZmZmYjEzNzAyZmMiLCJlbWFpbCI6ImNoYWtyYWJvcnR5bW91bGkxOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZGU1Y2JiYWVjMzU2OWQ4NmE3OWQiLCJzY29wZWRrZXlTZWNyZXQiOiJlNTE2NmU3NWY3MTk4YTY1NzY2N2YwNjA1ODRmYzllMWNmMzAwNDY1MjY0NmY2MjEzZjJiODllMTcxNGJkNDZlIiwiZXhwIjoxNzg4MDMzMTc2fQ.6wzbAqfWF5OxXyf9S0fiy2b_M8xs4T1MtMrpx5joBbQ";

// Test metadata
const testMetadata = {
  name: "Test Document",
  description: "This is a test document for Pinata upload",
  timestamp: Date.now(),
  test: true
};

console.log("Testing Pinata upload function...");
console.log("Test metadata:", testMetadata);

// Note: This is a Node.js test file, but your actual function runs in the browser
// You'll need to test it in your React application
console.log("\nTo test in your app:");
console.log("1. Update your .env file with: NEXT_PUBLIC_PINATA_JWT=your_jwt_here");
console.log("2. Use the uploadToPinata() function in your React components");
console.log("3. Check the browser console for any errors");


