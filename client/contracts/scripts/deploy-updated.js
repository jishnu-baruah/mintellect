const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying updated MintellectNFT contract...");

  // Get the contract factory
  const MintellectNFT = await ethers.getContractFactory("MintellectNFT");

  // Deploy the contract
  const mintellectNFT = await MintellectNFT.deploy();

  // Wait for deployment to complete
  await mintellectNFT.waitForDeployment();

  const contractAddress = await mintellectNFT.getAddress();
  console.log("✅ Contract deployed to:", contractAddress);

  // Get deployment info
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployed by:", deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Verify contract is working
  console.log("\n🔍 Verifying contract functionality...");
  
  // Check initial values
  const mintPrice = await mintellectNFT.mintPrice();
  const publicMintingEnabled = await mintellectNFT.publicMintingEnabled();
  const maxTotalSupply = await mintellectNFT.maxTotalSupply();
  const maxTokensPerWallet = await mintellectNFT.maxTokensPerWallet();
  const totalSupply = await mintellectNFT.totalSupply();

  console.log("📊 Contract Configuration:");
  console.log("  - Mint Price:", ethers.formatEther(mintPrice), "EDU");
  console.log("  - Public Minting:", publicMintingEnabled ? "Enabled" : "Disabled");
  console.log("  - Max Total Supply:", maxTotalSupply.toString());
  console.log("  - Max Tokens Per Wallet:", maxTokensPerWallet.toString());
  console.log("  - Current Total Supply:", totalSupply.toString());

  // Test admin minting (should work)
  console.log("\n🧪 Testing admin minting...");
  try {
    const adminMintTx = await mintellectNFT.mintNFT(
      deployer.address,
      "ipfs://QmTestAdminMint123456789"
    );
    await adminMintTx.wait();
    console.log("✅ Admin minting works");
  } catch (error) {
    console.log("❌ Admin minting failed:", error.message);
  }

  // Test public minting (should work if enabled)
  console.log("\n🧪 Testing public minting...");
  try {
    const publicMintTx = await mintellectNFT.mintPublic(
      "ipfs://QmTestPublicMint123456789",
      { value: mintPrice }
    );
    await publicMintTx.wait();
    console.log("✅ Public minting works");
  } catch (error) {
    console.log("❌ Public minting failed:", error.message);
  }

  // Final supply check
  const finalSupply = await mintellectNFT.totalSupply();
  console.log("\n📈 Final total supply:", finalSupply.toString());

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Update your frontend contract address to:", contractAddress);
  console.log("2. Verify the contract on blockchain explorer");
  console.log("3. Test the public minting functionality");
  console.log("4. Update your frontend to use mintPublic() function");

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: await ethers.provider.getNetwork(),
    timestamp: new Date().toISOString(),
    mintPrice: ethers.formatEther(mintPrice),
    publicMintingEnabled,
    maxTotalSupply: maxTotalSupply.toString(),
    maxTokensPerWallet: maxTokensPerWallet.toString()
  };

  const fs = require('fs');
  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
