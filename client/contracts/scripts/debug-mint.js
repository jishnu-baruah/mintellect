const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Debugging mintPublic function...");

  const contractAddress = "0x8df311Efb8160a4Cde6f13C47D0E4c21F949CbdD";
  const [deployer] = await ethers.getSigners();

  console.log("📋 Debug Details:");
  console.log("  - Contract:", contractAddress);
  console.log("  - Deployer:", deployer.address);
  console.log("  - Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

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

  // Test with a simple token URI
  const testTokenURI = "https://gateway.pinata.cloud/ipfs/bafkreiff6g46ltlcry4coxycmeihufnfxvbryreamz3xx7dwodaq4eanyi";
  const mintPrice = config.price;

  console.log("\n🧪 Testing mintPublic with parameters:");
  console.log("  - Token URI:", testTokenURI);
  console.log("  - Mint Price:", ethers.formatEther(mintPrice), "EDU");
  console.log("  - Value to send:", ethers.formatEther(mintPrice), "EDU");

  try {
    // First, let's estimate gas
    console.log("\n⛽ Estimating gas...");
    const gasEstimate = await contract.mintPublic.estimateGas(testTokenURI, {
      value: mintPrice
    });
    console.log("  - Gas estimate:", gasEstimate.toString());

    // Get current gas price
    const feeData = await ethers.provider.getFeeData();
    console.log("  - Gas price:", ethers.formatUnits(feeData.gasPrice, 'gwei'), "gwei");
    console.log("  - Max fee per gas:", feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : "N/A", "gwei");
    console.log("  - Max priority fee per gas:", feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') : "N/A", "gwei");

    // Try the actual minting
    console.log("\n🚀 Attempting to mint...");
    const tx = await contract.mintPublic(testTokenURI, {
      value: mintPrice,
      gasLimit: gasEstimate * 120n / 100n // Add 20% buffer
    });

    console.log("  - Transaction hash:", tx.hash);
    console.log("  - Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("  - Transaction confirmed!");
    console.log("  - Gas used:", receipt.gasUsed.toString());
    console.log("  - Status:", receipt.status === 1 ? "Success" : "Failed");

    // Check final supply
    const finalSupply = await contract.totalSupply();
    console.log("  - Final supply:", finalSupply.toString());

  } catch (error) {
    console.error("❌ Error during minting:", error.message);
    
    // Try to get more specific error information
    if (error.data) {
      console.log("  - Error data:", error.data);
    }
    if (error.reason) {
      console.log("  - Error reason:", error.reason);
    }
    if (error.code) {
      console.log("  - Error code:", error.code);
    }

    // Try with different gas settings
    console.log("\n🔧 Trying with different gas settings...");
    try {
      const tx2 = await contract.mintPublic(testTokenURI, {
        value: mintPrice,
        gasLimit: 500000 // Fixed gas limit
      });
      console.log("  - Success with fixed gas limit!");
      console.log("  - Transaction hash:", tx2.hash);
    } catch (error2) {
      console.error("  - Still failed with fixed gas:", error2.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
