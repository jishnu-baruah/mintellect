const { run } = require("hardhat");

async function main() {
  // Read deployment info
  const fs = require('fs');
  let deploymentInfo;
  
  try {
    const data = fs.readFileSync('./deployment-info.json', 'utf8');
    deploymentInfo = JSON.parse(data);
  } catch (error) {
    console.error("❌ Could not read deployment-info.json");
    console.log("Please run deployment script first");
    process.exit(1);
  }

  const contractAddress = deploymentInfo.contractAddress;
  const network = deploymentInfo.network;

  console.log("🔍 Verifying contract at:", contractAddress);
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId, ")");

  try {
    // Verify the contract
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // No constructor arguments for this contract
    });

    console.log("✅ Contract verified successfully!");
    console.log("🔗 View on explorer:");
    
    // Generate explorer links based on network
    if (network.chainId === 1n) {
      console.log(`   Mainnet: https://etherscan.io/address/${contractAddress}`);
    } else if (network.chainId === 11155111n) {
      console.log(`   Sepolia: https://sepolia.etherscan.io/address/${contractAddress}`);
    } else if (network.chainId === 421614n) {
      console.log(`   Arbitrum Sepolia: https://sepolia.arbiscan.io/address/${contractAddress}`);
    } else {
      console.log(`   Explorer: Check your network's block explorer for address ${contractAddress}`);
    }

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      
      // Manual verification instructions
      console.log("\n📝 Manual verification steps:");
      console.log("1. Go to your network's block explorer");
      console.log("2. Find your contract address:", contractAddress);
      console.log("3. Click 'Verify and Publish'");
      console.log("4. Select 'Solidity (Single file)'");
      console.log("5. Copy the contract code from contracts/MintellectNFT.sol");
      console.log("6. Set compiler version to 0.8.28");
      console.log("7. Set optimization to enabled, 200 runs");
      console.log("8. Leave constructor arguments empty");
      console.log("9. Click 'Verify and Publish'");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });
