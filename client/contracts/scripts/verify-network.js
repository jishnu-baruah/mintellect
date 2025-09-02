const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verifying EduChain Testnet Network Configuration...");
  
  try {
    // Get network information
    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    const blockNumber = await ethers.provider.getBlockNumber();
    const gasPrice = await ethers.provider.getFeeData();
    
    console.log("📊 Network Information:");
    console.log("   Chain ID:", chainId.toString());
    console.log("   Expected Chain ID: 656476");
    console.log("   Chain ID Match:", chainId.toString() === "656476" ? "✅ PASS" : "❌ FAIL");
    console.log("   Current Block:", blockNumber);
    console.log("   Gas Price:", ethers.formatUnits(gasPrice.gasPrice || 0, "gwei"), "gwei");
    
    // Get deployer account
    const signers = await ethers.getSigners();
    if (signers.length === 0) {
      console.log("\n👤 Deployer Account:");
      console.log("   Status: ❌ NO ACCOUNTS AVAILABLE");
      console.log("   Issue: Private key not configured or invalid");
      console.log("   Solution: Add your private key to .env file");
      
      console.log("\n🌐 RPC Connection Test:");
      try {
        const latestBlock = await ethers.provider.getBlock("latest");
        console.log("   RPC Status: ✅ CONNECTED");
        console.log("   Latest Block Hash:", latestBlock.hash);
        console.log("   Block Timestamp:", new Date(Number(latestBlock.timestamp) * 1000).toISOString());
      } catch (error) {
        console.log("   RPC Status: ❌ FAILED");
        console.log("   Error:", error.message);
      }
      
      console.log("\n📋 Network Configuration Summary:");
      const config = {
        networkName: "EDU Chain Testnet",
        rpcUrl: "https://rpc.open-campus-codex.gelato.digital",
        chainId: 656476,
        currencySymbol: "EDU",
        blockExplorer: "https://edu-chain-testnet.blockscout.com"
      };
      
      console.log("   Network Name:", config.networkName);
      console.log("   RPC URL:", config.rpcUrl);
      console.log("   Chain ID:", config.chainId);
      console.log("   Currency Symbol:", config.currencySymbol);
      console.log("   Block Explorer:", config.blockExplorer);
      
      console.log("\n✅ Validation Results:");
      console.log("   Chain ID Valid:", chainId.toString() === "656476" ? "✅ PASS" : "❌ FAIL");
      console.log("   RPC Working:", blockNumber > 0 ? "✅ PASS" : "❌ FAIL");
      console.log("   Account Valid: ❌ FAIL");
      
      console.log("\n⚠️  Network is configured correctly, but private key is missing.");
      console.log("📝 To fix this:");
      console.log("   1. Open your .env file");
      console.log("   2. Replace 'your_private_key_here' with your actual private key");
      console.log("   3. Private key should start with '0x' and be 64 characters long");
      console.log("   4. Run this script again");
      
      return;
    }
    
    const deployer = signers[0];
    const balance = await ethers.provider.getBalance(deployer.address);
    
    console.log("\n👤 Deployer Account:");
    console.log("   Address:", deployer.address);
    console.log("   Balance:", ethers.formatEther(balance), "EDU");
    console.log("   Balance Check:", balance > 0n ? "✅ SUFFICIENT" : "❌ INSUFFICIENT");
    
    // Test RPC connection
    console.log("\n🌐 RPC Connection Test:");
    try {
      const latestBlock = await ethers.provider.getBlock("latest");
      console.log("   RPC Status: ✅ CONNECTED");
      console.log("   Latest Block Hash:", latestBlock.hash);
      console.log("   Block Timestamp:", new Date(Number(latestBlock.timestamp) * 1000).toISOString());
    } catch (error) {
      console.log("   RPC Status: ❌ FAILED");
      console.log("   Error:", error.message);
    }
    
    // Test transaction simulation
    console.log("\n🧪 Transaction Simulation Test:");
    try {
      const tx = {
        to: deployer.address,
        value: 0n,
        gasLimit: 21000n
      };
      
      const estimatedGas = await ethers.provider.estimateGas(tx);
      console.log("   Gas Estimation: ✅ WORKING");
      console.log("   Estimated Gas for Simple Transfer:", estimatedGas.toString());
    } catch (error) {
      console.log("   Gas Estimation: ❌ FAILED");
      console.log("   Error:", error.message);
    }
    
    // Network configuration summary
    console.log("\n📋 Network Configuration Summary:");
    
    const config = {
      networkName: "EDU Chain Testnet",
      rpcUrl: "https://rpc.open-campus-codex.gelato.digital",
      chainId: 656476,
      currencySymbol: "EDU",
      blockExplorer: "https://edu-chain-testnet.blockscout.com"
    };
    
    console.log("   Network Name:", config.networkName);
    console.log("   RPC URL:", config.rpcUrl);
    console.log("   Chain ID:", config.chainId);
    console.log("   Currency Symbol:", config.currencySymbol);
    console.log("   Block Explorer:", config.blockExplorer);
    
    // Validation results
    console.log("\n✅ Validation Results:");
    
    const chainIdValid = chainId.toString() === "656476";
    const rpcWorking = balance > 0n || blockNumber > 0;
    const accountValid = deployer.address !== ethers.ZeroAddress;
    
    console.log("   Chain ID Valid:", chainIdValid ? "✅ PASS" : "❌ FAIL");
    console.log("   RPC Working:", rpcWorking ? "✅ PASS" : "❌ FAIL");
    console.log("   Account Valid:", accountValid ? "✅ PASS" : "❌ FAIL");
    
    if (chainIdValid && rpcWorking && accountValid) {
      console.log("\n🎉 All checks passed! Network is properly configured.");
      console.log("📝 Ready for deployment and testing.");
    } else {
      console.log("\n⚠️  Some checks failed. Please review your configuration.");
      
      if (!chainIdValid) {
        console.log("   ❌ Chain ID mismatch. Check hardhat.config.js");
      }
      if (!rpcWorking) {
        console.log("   ❌ RPC connection failed. Check network connectivity.");
      }
      if (!accountValid) {
        console.log("   ❌ Account not properly configured. Check .env file.");
      }
    }
    
    // Recommendations
    console.log("\n💡 Recommendations:");
    if (balance <= ethers.parseEther("0.01")) {
      console.log("   ⚠️  Low balance detected. Consider getting more EDU tokens for testing.");
    }
    if (gasPrice.gasPrice && gasPrice.gasPrice > ethers.parseUnits("100", "gwei")) {
      console.log("   ⚠️  High gas prices detected. Consider waiting for lower gas costs.");
    }
    
    console.log("   💡 Use 'npm run deploy' to deploy your contract");
    console.log("   💡 Use 'npm run test:gas' to test gas usage");
    
  } catch (error) {
    console.error("❌ Network verification failed:", error.message);
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
