const { ethers } = require("hardhat");

async function main() {
  console.log("🔧 Resetting contract configuration...");

  const contractAddress = "0x8df311Efb8160a4Cde6f13C47D0E4c21F949CbdD";
  const [deployer] = await ethers.getSigners();

  console.log("📋 Contract Details:");
  console.log("  - Address:", contractAddress);
  console.log("  - Deployer:", deployer.address);

  // Get contract instance
  const MintellectNFT = await ethers.getContractFactory("MintellectNFT");
  const contract = MintellectNFT.attach(contractAddress);

  try {
    // Reset mint price to 0.01 EDU
    console.log("Setting mint price to 0.01 EDU...");
    const setPriceTx = await contract.setMintPrice(ethers.parseEther("0.01"));
    await setPriceTx.wait();
    console.log("✅ Mint price set to 0.01 EDU");

    // Reset max tokens per wallet to 10
    console.log("Setting max tokens per wallet to 10...");
    const setMaxWalletTx = await contract.setMaxTokensPerWallet(10);
    await setMaxWalletTx.wait();
    console.log("✅ Max tokens per wallet set to 10");

    // Reset max total supply to 10000
    console.log("Setting max total supply to 10000...");
    const setMaxSupplyTx = await contract.setMaxTotalSupply(10000);
    await setMaxSupplyTx.wait();
    console.log("✅ Max total supply set to 10000");

    // Ensure public minting is enabled
    console.log("Enabling public minting...");
    const setPublicTx = await contract.setPublicMintingEnabled(true);
    await setPublicTx.wait();
    console.log("✅ Public minting enabled");

    // Check final configuration
    console.log("\n✅ Final Configuration:");
    const config = await contract.getMintingConfig();
    console.log("  - Mint Price:", ethers.formatEther(config.price), "EDU");
    console.log("  - Public Minting:", config.enabled ? "Enabled" : "Disabled");
    console.log("  - Max Supply:", config.maxSupply.toString());
    console.log("  - Max Per Wallet:", config.maxPerWallet.toString());
    console.log("  - Current Supply:", config.currentSupply.toString());

    console.log("\n🎉 Contract configuration reset complete!");
    console.log("You can now test minting from the frontend with 0.01 EDU.");

  } catch (error) {
    console.error("❌ Error resetting configuration:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
