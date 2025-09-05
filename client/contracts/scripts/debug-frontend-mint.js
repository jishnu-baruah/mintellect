const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Debugging frontend mintPublic call...");

  const contractAddress = "0x8df311Efb8160a4Cde6f13C47D0E4c21F949CbdD";
  const [deployer] = await ethers.getSigners();

  console.log("📋 Debug Details:");
  console.log("  - Contract:", contractAddress);
  console.log("  - Deployer:", deployer.address);
  console.log("  - Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Get contract instance
  const MintellectNFT = await ethers.getContractFactory("MintellectNFT");
  const contract = MintellectNFT.attach(contractAddress);

  // Test with the exact same parameters as frontend
  const testTokenURI = "https://gateway.pinata.cloud/ipfs/bafkreiambjqbwkbtrr2qi5ilf7w5e7kcsrp6bg7gn2xq3jitwhluwjlntu";
  const mintPrice = ethers.parseEther("0.01");

  console.log("\n🧪 Testing with frontend parameters:");
  console.log("  - Token URI:", testTokenURI);
  console.log("  - Mint Price:", ethers.formatEther(mintPrice), "EDU");
  console.log("  - Value to send:", ethers.formatEther(mintPrice), "EDU");

  // Check contract state first
  console.log("\n🔍 Contract State Check:");
  try {
    const config = await contract.getMintingConfig();
    console.log("  - Mint Price:", ethers.formatEther(config.price), "EDU");
    console.log("  - Public Minting:", config.enabled ? "Enabled" : "Disabled");
    console.log("  - Max Supply:", config.maxSupply.toString());
    console.log("  - Max Per Wallet:", config.maxPerWallet.toString());
    console.log("  - Current Supply:", config.currentSupply.toString());

    const walletStats = await contract.getWalletMintStats(deployer.address);
    console.log("  - Deployer minted:", walletStats.minted.toString());
    console.log("  - Deployer remaining:", walletStats.remaining.toString());
  } catch (error) {
    console.error("❌ Error checking contract state:", error.message);
    return;
  }

  // Test different gas settings
  const gasSettings = [
    { name: "Low Gas", gas: 1000000 },
    { name: "Medium Gas", gas: 5000000 },
    { name: "High Gas", gas: 15000000 },
    { name: "Very High Gas", gas: 20000000 }
  ];

  for (const setting of gasSettings) {
    console.log(`\n🧪 Testing with ${setting.name} (${setting.gas} gas):`);
    
    try {
      // First estimate gas
      const gasEstimate = await contract.mintPublic.estimateGas(testTokenURI, {
        value: mintPrice
      });
      console.log(`  - Gas estimate: ${gasEstimate.toString()}`);
      console.log(`  - Using gas limit: ${setting.gas}`);

      // Try the transaction
      const tx = await contract.mintPublic(testTokenURI, {
        value: mintPrice,
        gasLimit: setting.gas
      });

      console.log(`  - Transaction hash: ${tx.hash}`);
      console.log(`  - Waiting for confirmation...`);

      const receipt = await tx.wait();
      console.log(`  - ✅ SUCCESS with ${setting.name}!`);
      console.log(`  - Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`  - Status: ${receipt.status === 1 ? "Success" : "Failed"}`);

      // Check final supply
      const finalSupply = await contract.totalSupply();
      console.log(`  - Final supply: ${finalSupply.toString()}`);

      // If successful, break out of the loop
      break;

    } catch (error) {
      console.log(`  - ❌ Failed with ${setting.name}: ${error.message}`);
      
      // Try to get more specific error information
      if (error.data) {
        console.log(`    - Error data: ${error.data}`);
      }
      if (error.reason) {
        console.log(`    - Error reason: ${error.reason}`);
      }
      if (error.code) {
        console.log(`    - Error code: ${error.code}`);
      }
    }
  }

  // Test with different value amounts
  console.log("\n🧪 Testing with different value amounts:");
  const valueAmounts = [
    { name: "Exact", value: ethers.parseEther("0.01") },
    { name: "Slightly More", value: ethers.parseEther("0.011") },
    { name: "Much More", value: ethers.parseEther("0.1") }
  ];

  for (const amount of valueAmounts) {
    console.log(`\n  Testing with ${amount.name} (${ethers.formatEther(amount.value)} EDU):`);
    
    try {
      const tx = await contract.mintPublic(testTokenURI, {
        value: amount.value,
        gasLimit: 20000000
      });

      console.log(`  - ✅ SUCCESS with ${amount.name}!`);
      console.log(`  - Transaction hash: ${tx.hash}`);
      break;

    } catch (error) {
      console.log(`  - ❌ Failed with ${amount.name}: ${error.message}`);
    }
  }

  // Test with different RPC endpoints
  console.log("\n🧪 Testing RPC endpoint:");
  try {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`  - Current block number: ${blockNumber}`);
    
    const network = await ethers.provider.getNetwork();
    console.log(`  - Network: ${network.name} (Chain ID: ${network.chainId})`);
    
    const feeData = await ethers.provider.getFeeData();
    console.log(`  - Gas price: ${ethers.formatUnits(feeData.gasPrice, 'gwei')} gwei`);
    
  } catch (error) {
    console.error(`  - ❌ RPC error: ${error.message}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
