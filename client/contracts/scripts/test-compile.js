const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing MintellectNFT Contract Compilation...");
  
  try {
    // Test contract compilation
    console.log("📦 Compiling MintellectNFT contract...");
    const MintellectNFT = await ethers.getContractFactory("MintellectNFT");
    console.log("✅ Contract compiled successfully!");
    
    // Get signers
    const signers = await ethers.getSigners();
    if (signers.length === 0) {
      console.log("⚠️  No signers available - using hardhat network");
      console.log("✅ Contract compilation test passed!");
      console.log("\n📝 Next Steps:");
      console.log("   1. Add your private key to .env file");
      console.log("   2. Run: npm run verify:network");
      console.log("   3. Run: npm run deploy");
      console.log("   4. Run: npm run test:gas");
      return;
    }
    
    const deployer = signers[0];
    console.log("👤 Using signer:", deployer.address);
    
    // Test contract deployment (local simulation)
    console.log("🚀 Testing contract deployment simulation...");
    const mintellectNFT = await MintellectNFT.deploy();
    await mintellectNFT.waitForDeployment();
    
    const contractAddress = await mintellectNFT.getAddress();
    console.log("✅ Contract deployment simulation successful!");
    console.log("   Contract Address:", contractAddress);
    
    // Test contract functions
    console.log("\n🔍 Testing Contract Functions...");
    
    const name = await mintellectNFT.name();
    const symbol = await mintellectNFT.symbol();
    const owner = await mintellectNFT.owner();
    const totalSupply = await mintellectNFT.totalSupply();
    const baseURI = await mintellectNFT.getBaseURI();
    const nextTokenId = await mintellectNFT.getNextTokenId();
    
    console.log("📋 Contract Details:");
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Owner:", owner);
    console.log("   Total Supply:", totalSupply.toString());
    console.log("   Base URI:", baseURI);
    console.log("   Next Token ID:", nextTokenId.toString());
    
    // Test minting simulation
    console.log("\n🧪 Testing Minting Function Calls...");
    try {
      const mintTx = await mintellectNFT.mintNFT(
        deployer.address, // Use deployer address
        "QmTestCID123456789", // Test IPFS CID
        { gasLimit: 500000n }
      );
      console.log("   ✅ Minting function call successful!");
      console.log("   Transaction Hash:", mintTx.hash);
      
      // Wait for transaction
      const receipt = await mintTx.wait();
      console.log("   ✅ Transaction confirmed!");
      console.log("   Gas Used:", receipt.gasUsed.toString());
      
    } catch (error) {
      console.log("   ❌ Minting failed:", error.message);
    }
    
    // Test batch minting
    try {
      const batchURIs = ["QmCID1", "QmCID2", "QmCID3"];
      const batchTx = await mintellectNFT.batchMintNFT(
        deployer.address,
        batchURIs,
        { gasLimit: 1000000n }
      );
      console.log("   ✅ Batch minting function call successful!");
      console.log("   Transaction Hash:", batchTx.hash);
      
      // Wait for transaction
      const batchReceipt = await batchTx.wait();
      console.log("   ✅ Batch transaction confirmed!");
      console.log("   Gas Used:", batchReceipt.gasUsed.toString());
      
    } catch (error) {
      console.log("   ❌ Batch minting failed:", error.message);
    }
    
    // Test base URI setting
    try {
      const setBaseURITx = await mintellectNFT.setBaseURI("ipfs://");
      console.log("   ✅ Set Base URI function call successful!");
      console.log("   Transaction Hash:", setBaseURITx.hash);
      
      // Wait for transaction
      const setBaseURIReceipt = await setBaseURITx.wait();
      console.log("   ✅ Set Base URI transaction confirmed!");
      console.log("   Gas Used:", setBaseURIReceipt.gasUsed.toString());
      
    } catch (error) {
      console.log("   ❌ Set Base URI failed:", error.message);
    }
    
    console.log("\n🎉 Contract Compilation and Function Testing Completed!");
    console.log("📝 Next Steps:");
    console.log("   1. Add your private key to .env file");
    console.log("   2. Run: npm run verify:network");
    console.log("   3. Run: npm run deploy");
    console.log("   4. Run: npm run test:gas");
    
  } catch (error) {
    console.error("❌ Contract testing failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script execution failed:", error);
    process.exit(1);
  });
