// scripts/deploy.js

async function main() {
  try {
    const hre = require("hardhat");
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY not found in environment. Please check your .env file.");
    }
    const [deployer] = await hre.ethers.getSigners();
    if (!deployer) {
      throw new Error("No deployer account found. Check your .env and Hardhat config.");
    }
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Network:", hre.network.name);
    console.log("Private key present:", process.env.PRIVATE_KEY ? "yes" : "no");

    const MintellectNFT = await hre.ethers.getContractFactory("MintellectNFT");
    const contract = await MintellectNFT.deploy();
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log("MintellectNFT deployed to:", contractAddress);
  } catch (err) {
    console.error("[DEPLOY ERROR]", err);
    if (err.stack) {
      console.error("[STACK TRACE]", err.stack);
    }
    process.exitCode = 1;
  }
}

main(); 