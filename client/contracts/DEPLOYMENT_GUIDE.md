# MintellectNFT Contract Deployment Guide

## 🚀 Updated Contract Features

The updated `MintellectNFT.sol` contract now includes:

### ✅ **Public Minting Functions**
- `mintPublic(string tokenURI)` - Single NFT minting by any user
- `batchMintPublic(string[] tokenURIs)` - Batch minting (up to 5 NFTs)

### ✅ **Payment System**
- Users pay `mintPrice` in EDU tokens (1:1 with ETH for simplicity)
- Owner can set/update mint price via `setMintPrice()`
- Automatic payment validation

### ✅ **Security Features**
- `ReentrancyGuard` protection
- Maximum tokens per wallet (anti-spam)
- Maximum total supply limit
- Owner can toggle public minting on/off

### ✅ **Admin Functions** (Preserved)
- Original `mintNFT()` and `batchMintNFT()` for owner
- All existing admin functions maintained

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Hardhat** installed
3. **Ethers.js** v6
4. **OpenZeppelin** contracts
5. **Network RPC URL** (EduChain Testnet or your target network)
6. **Private Key** for deployment
7. **Block Explorer API Key** (for verification)

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd mintellect/client/contracts
npm install
```

### 2. Install Required Packages
```bash
npm install @openzeppelin/contracts@^5.0.0
npm install --save-dev @nomicfoundation/hardhat-verify
```

### 3. Update hardhat.config.js
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    educhain: {
      url: "https://rpc.open-campus-codex.gelato.digital",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 420614
    },
    // Add other networks as needed
  },
  etherscan: {
    apiKey: {
      educhain: process.env.EDUCHAIN_API_KEY || "your-api-key"
    },
    customChains: [
      {
        network: "educhain",
        chainId: 420614,
        urls: {
          apiURL: "https://blockscout.open-campus-codex.gelato.digital/api",
          browserURL: "https://blockscout.open-campus-codex.gelato.digital"
        }
      }
    ]
  }
};
```

### 4. Create .env file
```bash
# .env
PRIVATE_KEY=your_private_key_here
EDUCHAIN_API_KEY=your_blockscout_api_key_here
```

## 🚀 Deployment Steps

### Step 1: Compile Contract
```bash
npx hardhat compile
```

### Step 2: Deploy Contract
```bash
npx hardhat run scripts/deploy-updated.js --network educhain
```

**Expected Output:**
```
🚀 Deploying updated MintellectNFT contract...
✅ Contract deployed to: 0x...
📝 Deployed by: 0x...
💰 Deployer balance: 1.5 ETH
🔍 Verifying contract functionality...
📊 Contract Configuration:
  - Mint Price: 0.01 EDU
  - Public Minting: Enabled
  - Max Total Supply: 10000
  - Max Tokens Per Wallet: 10
  - Current Total Supply: 0
🧪 Testing admin minting...
✅ Admin minting works
🧪 Testing public minting...
✅ Public minting works
📈 Final total supply: 2
🎉 Deployment completed successfully!
```

### Step 3: Verify Contract
```bash
npx hardhat run scripts/verify-contract.js --network educhain
```

**Expected Output:**
```
🔍 Verifying contract at: 0x...
🌐 Network: educhain (Chain ID: 420614)
✅ Contract verified successfully!
🔗 View on explorer: https://blockscout.open-campus-codex.gelato.digital/address/0x...
```

## 🔧 Configuration After Deployment

### 1. Set Mint Price (Optional)
```javascript
// Using ethers.js
const contract = new ethers.Contract(contractAddress, abi, signer);
await contract.setMintPrice(ethers.parseEther("0.005")); // 0.005 EDU
```

### 2. Configure Limits (Optional)
```javascript
// Set maximum total supply
await contract.setMaxTotalSupply(5000);

// Set maximum tokens per wallet
await contract.setMaxTokensPerWallet(5);

// Toggle public minting
await contract.setPublicMintingEnabled(false); // Disable if needed
```

### 3. Set Base URI for IPFS
```javascript
await contract.setBaseURI("https://gateway.pinata.cloud/ipfs/");
```

## 🎯 Frontend Integration

### 1. Update Contract Address
```javascript
// In your frontend
const CONTRACT_ADDRESS = "0x..."; // Your deployed contract address
```

### 2. Update ABI
```javascript
// Copy the ABI from artifacts/contracts/MintellectNFT.sol/MintellectNFT.json
import contractABI from "./MintellectNFT_ABI.json";
```

### 3. Use Public Minting Function
```javascript
// For single NFT minting
const mintTx = await contract.mintPublic(tokenURI, {
  value: ethers.parseEther("0.01") // Pay mint price
});

// For batch minting
const batchMintTx = await contract.batchMintPublic(tokenURIs, {
  value: ethers.parseEther("0.01").mul(tokenURIs.length) // Pay for each NFT
});
```

### 4. Check Minting Status
```javascript
// Get minting configuration
const config = await contract.getMintingConfig();
console.log("Mint Price:", ethers.formatEther(config.price));
console.log("Public Minting:", config.enabled);

// Check wallet mint stats
const stats = await contract.getWalletMintStats(userAddress);
console.log("Minted by wallet:", stats.minted.toString());
console.log("Remaining mints:", stats.remaining.toString());
```

## 🧪 Testing the Contract

### 1. Test Public Minting
```javascript
// Connect to contract
const contract = new ethers.Contract(contractAddress, abi, signer);

// Mint a single NFT
const tx = await contract.mintPublic("ipfs://QmYourMetadataHash", {
  value: ethers.parseEther("0.01")
});
await tx.wait();
console.log("NFT minted successfully!");
```

### 2. Test Batch Minting
```javascript
const tokenURIs = [
  "ipfs://QmHash1",
  "ipfs://QmHash2",
  "ipfs://QmHash3"
];

const tx = await contract.batchMintPublic(tokenURIs, {
  value: ethers.parseEther("0.01").mul(tokenURIs.length)
});
await tx.wait();
console.log("Batch minting successful!");
```

### 3. Test Admin Functions
```javascript
// Admin minting (no payment required)
const adminTx = await contract.mintNFT(userAddress, "ipfs://QmHash");
await adminTx.wait();

// Batch admin minting
const batchAdminTx = await contract.batchMintNFT(userAddress, tokenURIs);
await batchAdminTx.wait();
```

## 🔍 Contract Verification

### Automatic Verification
The deployment script automatically attempts verification. If it fails, you can run:

```bash
npx hardhat verify --network educhain <CONTRACT_ADDRESS>
```

### Manual Verification
1. Go to [EduChain Block Explorer](https://blockscout.open-campus-codex.gelato.digital)
2. Find your contract address
3. Click "Verify and Publish"
4. Select "Solidity (Single file)"
5. Copy the contract code
6. Set compiler version to 0.8.28
7. Set optimization to enabled, 200 runs
8. Leave constructor arguments empty

## 📊 Contract Functions Reference

### Public Functions
- `mintPublic(string tokenURI)` - Mint single NFT (payable)
- `batchMintPublic(string[] tokenURIs)` - Mint multiple NFTs (payable)
- `totalSupply()` - Get total number of minted tokens
- `getMintingConfig()` - Get contract configuration
- `getWalletMintStats(address wallet)` - Get wallet minting stats

### Admin Functions
- `mintNFT(address to, string tokenURI)` - Admin minting
- `batchMintNFT(address to, string[] tokenURIs)` - Admin batch minting
- `setMintPrice(uint256 newPrice)` - Set mint price
- `setPublicMintingEnabled(bool enabled)` - Toggle public minting
- `setMaxTotalSupply(uint256 newMax)` - Set max total supply
- `setMaxTokensPerWallet(uint256 newMax)` - Set max per wallet
- `setBaseURI(string baseURI)` - Set base URI
- `withdraw()` - Withdraw contract balance

## 🚨 Important Notes

1. **Gas Costs**: Public minting costs gas + mint price
2. **Payment**: Users must send exact mint price or more
3. **Limits**: Respect max tokens per wallet and total supply
4. **Security**: ReentrancyGuard prevents reentrancy attacks
5. **Upgrades**: Contract is not upgradeable (immutable)

## 🆘 Troubleshooting

### Common Issues

1. **"Insufficient payment"**
   - User didn't send enough ETH/EDU
   - Check mint price with `mintPrice()`

2. **"Public minting is disabled"**
   - Owner disabled public minting
   - Call `setPublicMintingEnabled(true)`

3. **"Max tokens per wallet exceeded"**
   - User already minted maximum allowed
   - Check with `getWalletMintStats()`

4. **"Maximum supply reached"**
   - Contract reached max total supply
   - Increase with `setMaxTotalSupply()`

### Getting Help

- Check contract on block explorer
- Verify transaction details
- Check gas limits and prices
- Ensure proper network connection

## 🎉 Success!

Your contract is now deployed and ready for decentralized minting! Users can now:

1. Connect their wallet
2. Pay the mint price
3. Mint NFTs directly
4. Own their NFTs on the blockchain

The frontend will show wallet popups for transaction confirmation, and users will pay gas fees from their own wallet.
