const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking contract configuration...");

  // Read deployment info
  const fs = require('fs');
  let deploymentInfo;
  
  try {
    const data = fs.readFileSync('./deployment-info.json', 'utf8');
    deploymentInfo = JSON.parse(data);
  } catch (error) {
    console.error("❌ Could not read deployment-info.json");
    process.exit(1);
  }

  const contractAddress = deploymentInfo.contractAddress;
  const [deployer] = await ethers.getSigners();

  console.log("📋 Contract Details:");
  console.log("  - Address:", contractAddress);
  console.log("  - Deployer:", deployer.address);

  // Get contract instance
  const MintellectNFT = await ethers.getContractFactory("MintellectNFT");
  const contract = MintellectNFT.attach(contractAddress);

  // Check current configuration
  console.log("\n🔍 Current Configuration:");
  const config = await contract.getMintingConfig();
  console.log("  - Mint Price:", ethers.formatEther(config.price), "EDU");
  console.log("  - Public Minting:", config.enabled ? "Enabled" : "Disabled");
  console.log("  - Max Supply:", config.maxSupply.toString());
  console.log("  - Max Per Wallet:", config.maxPerWallet.toString());
  console.log("  - Current Supply:", config.currentSupply.toString());

  // Check wallet stats
  console.log("\n🔍 Wallet Stats:");
  const walletStats = await contract.getWalletMintStats(deployer.address);
  console.log("  - Deployer minted:", walletStats.minted.toString());
  console.log("  - Deployer remaining:", walletStats.remaining.toString());

  // Reset configuration for testing
  console.log("\n🔧 Resetting configuration for testing...");
  
  try {
    // Reset mint price to 0.01 EDU
    const setPriceTx = await contract.setMintPrice(ethers.parseEther("0.01"));
    await setPriceTx.wait();
    console.log("  ✅ Mint price reset to 0.01 EDU");

    // Reset max tokens per wallet to 10
    const setMaxWalletTx = await contract.setMaxTokensPerWallet(10);
    await setMaxWalletTx.wait();
    console.log("  ✅ Max tokens per wallet reset to 10");

    // Reset max total supply to 10000
    const setMaxSupplyTx = await contract.setMaxTotalSupply(10000);
    await setMaxSupplyTx.wait();
    console.log("  ✅ Max total supply reset to 10000");

    // Ensure public minting is enabled
    const setPublicTx = await contract.setPublicMintingEnabled(true);
    await setPublicTx.wait();
    console.log("  ✅ Public minting enabled");

  } catch (error) {
    console.error("❌ Error resetting configuration:", error.message);
  }

  // Check final configuration
  console.log("\n✅ Final Configuration:");
  const finalConfig = await contract.getMintingConfig();
  console.log("  - Mint Price:", ethers.formatEther(finalConfig.price), "EDU");
  console.log("  - Public Minting:", finalConfig.enabled ? "Enabled" : "Disabled");
  console.log("  - Max Supply:", finalConfig.maxSupply.toString());
  console.log("  - Max Per Wallet:", finalConfig.maxPerWallet.toString());
  console.log("  - Current Supply:", finalConfig.currentSupply.toString());

  console.log("\n🎉 Contract configuration reset complete!");
  console.log("You can now test minting from the frontend.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
