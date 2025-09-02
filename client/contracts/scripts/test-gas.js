const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing MintellectNFT Gas Usage on EduChain Testnet...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Testing with account:", deployer.address);
  
  // Deploy the contract for testing
  console.log("📦 Deploying MintellectNFT for gas testing...");
  const MintellectNFT = await ethers.getContractFactory("MintellectNFT");
  const mintellectNFT = await MintellectNFT.deploy();
  await mintellectNFT.waitForDeployment();
  
  const contractAddress = await mintellectNFT.getAddress();
  console.log("✅ Contract deployed at:", contractAddress);
  
  // Test single mint gas usage
  console.log("\n🔍 Testing Single Mint Gas Usage...");
  
  const mintTx = await mintellectNFT.mintNFT(
    deployer.address,
    "QmTestCID123456789",
    { gasLimit: 1000000n }
  );
  
  const mintReceipt = await mintTx.wait();
  const gasUsed = mintReceipt.gasUsed;
  const gasPrice = mintReceipt.gasPrice || mintReceipt.effectiveGasPrice || 0n;
  const totalCost = gasUsed * gasPrice;
  
  console.log("📊 Single Mint Results:");
  console.log("   Gas Used:", gasUsed.toString());
  console.log("   Gas Price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
  console.log("   Total Cost:", ethers.formatEther(totalCost), "EDU");
  console.log("   Transaction Hash:", mintTx.hash);
  
  // Test batch mint gas usage
  console.log("\n🔍 Testing Batch Mint Gas Usage...");
  
  const batchURIs = [
    "QmBatchCID1",
    "QmBatchCID2", 
    "QmBatchCID3"
  ];
  
  const batchTx = await mintellectNFT.batchMintNFT(
    deployer.address,
    batchURIs,
    { gasLimit: 2000000n }
  );
  
  const batchReceipt = await batchTx.wait();
  const batchGasUsed = batchReceipt.gasUsed;
  const batchGasPrice = batchReceipt.gasPrice || batchReceipt.effectiveGasPrice || 0n;
  const batchTotalCost = batchGasUsed * batchGasPrice;
  
  console.log("📊 Batch Mint Results (3 tokens):");
  console.log("   Gas Used:", batchGasUsed.toString());
  console.log("   Gas Used per Token:", Math.floor(Number(batchGasUsed) / 3));
  console.log("   Gas Price:", ethers.formatUnits(batchGasPrice, "gwei"), "gwei");
  console.log("   Total Cost:", ethers.formatEther(batchTotalCost), "EDU");
  console.log("   Transaction Hash:", batchTx.hash);
  
  // Test base URI operations
  console.log("\n🔍 Testing Base URI Operations...");
  
  const setBaseURITx = await mintellectNFT.setBaseURI("ipfs://");
  const setBaseURIReceipt = await setBaseURITx.wait();
  
  console.log("📊 Set Base URI Results:");
  console.log("   Gas Used:", setBaseURIReceipt.gasUsed.toString());
  console.log("   Transaction Hash:", setBaseURITx.hash);
  
  // Get current state
  const totalSupply = await mintellectNFT.totalSupply();
  const baseURI = await mintellectNFT.getBaseURI();
  const nextTokenId = await mintellectNFT.getNextTokenId();
  
  console.log("\n📋 Contract State:");
  console.log("   Total Supply:", totalSupply.toString());
  console.log("   Base URI:", baseURI);
  console.log("   Next Token ID:", nextTokenId.toString());
  
  // Gas efficiency analysis
  console.log("\n📈 Gas Efficiency Analysis:");
  console.log("   Single Mint Target: <300k gas");
  console.log("   Single Mint Actual:", gasUsed.toString(), "gas");
  console.log("   Efficiency:", Number(gasUsed) <= 300000 ? "✅ PASS" : "❌ FAIL");
  
  const singleMintEfficiency = ((300000 - Number(gasUsed)) / 300000 * 100).toFixed(2);
  console.log("   Improvement:", singleMintEfficiency + "%");
  
  // Compare with old contract (12.8M gas)
  const oldGas = 12800000;
  const improvement = ((oldGas - Number(gasUsed)) / oldGas * 100).toFixed(2);
  console.log("   vs Old Contract (12.8M):", improvement + "% improvement");
  
  // Cost analysis
  console.log("\n💰 Cost Analysis (EDU Chain Testnet):");
  console.log("   Single Mint Cost:", ethers.formatEther(totalCost), "EDU");
  console.log("   Batch Mint Cost (3 tokens):", ethers.formatEther(batchTotalCost), "EDU");
  console.log("   Cost per Token (Batch):", ethers.formatEther(batchTotalCost / 3n), "EDU");
  
  console.log("\n🎉 Gas Testing Completed!");
  console.log("📝 Recommendations:");
  if (Number(gasUsed) <= 300000) {
    console.log("   ✅ Contract meets gas efficiency targets");
  } else {
    console.log("   ⚠️  Contract exceeds gas targets - consider further optimization");
  }
  console.log("   💡 Use batch minting for multiple NFTs to save gas");
  console.log("   💡 Set base URI once to reduce per-token storage costs");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Gas testing failed:", error);
    process.exit(1);
  });
