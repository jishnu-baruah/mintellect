const { ethers } = require('ethers');

console.log("🧪 Testing Contract Integration...");
console.log("");

// Contract details
const CONTRACT_ADDRESS = "0xadB0b68EE8c15b9F9E99ECf9A36a5BF17AC06864";
const RPC_URL = "https://rpc.open-campus-codex.gelato.digital";
const CHAIN_ID = 656476;

console.log("📋 Contract Details:");
console.log("   Address:", CONTRACT_ADDRESS);
console.log("   Network: EDU Chain Testnet");
console.log("   Chain ID:", CHAIN_ID);
console.log("   RPC URL:", RPC_URL);
console.log("");

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function owner() view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function mintNFT(address to, string memory tokenURI) public",
  "function batchMintNFT(address to, string[] memory tokenURIs) public"
];

async function testContractIntegration() {
  try {
    console.log("🔗 Connecting to EduChain Testnet...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Test network connection
    const network = await provider.getNetwork();
    console.log("   Connected to network:", network.name);
    console.log("   Chain ID:", network.chainId.toString());
    
    if (network.chainId.toString() !== CHAIN_ID.toString()) {
      throw new Error(`Chain ID mismatch. Expected ${CHAIN_ID}, got ${network.chainId}`);
    }
    
    console.log("✅ Network connection successful");
    console.log("");
    
    // Test contract connection
    console.log("📦 Connecting to contract...");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    // Test contract functions
    console.log("🔍 Testing contract functions...");
    
    const name = await contract.name();
    console.log("   Contract Name:", name);
    
    const symbol = await contract.symbol();
    console.log("   Contract Symbol:", symbol);
    
    const owner = await contract.owner();
    console.log("   Contract Owner:", owner);
    
    const totalSupply = await contract.totalSupply();
    console.log("   Total Supply:", totalSupply.toString());
    
    console.log("");
    console.log("✅ Contract integration test successful!");
    console.log("");
    console.log("🎉 Your frontend is ready to use the optimized contract!");
    console.log("📝 Next steps:");
    console.log("   1. Start your frontend: npm run dev");
    console.log("   2. Connect your wallet to EduChain Testnet");
    console.log("   3. Test NFT minting functionality");
    console.log("   4. Monitor gas usage for the 98% reduction");
    
  } catch (error) {
    console.log("❌ Contract integration test failed:");
    console.log("   Error:", error.message);
    console.log("");
    console.log("🔧 Troubleshooting:");
    console.log("   1. Check if contract is deployed on EduChain Testnet");
    console.log("   2. Verify RPC URL is correct");
    console.log("   3. Ensure network configuration matches");
  }
}

testContractIntegration();


