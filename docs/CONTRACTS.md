# Mintellect - Smart Contracts Documentation

## 🎯 Smart Contracts Overview

The Mintellect smart contracts provide the blockchain infrastructure for minting research papers as NFTs, ensuring immutable ownership and provenance of academic work on the Educhain network.

### 🏗️ Technology Stack

#### Blockchain Network
- **Educhain Testnet** - Primary deployment network
- **Chain ID**: 656476
- **RPC URL**: `https://rpc.open-campus-codex.gelato.digital`
- **Block Explorer**: [Educhain Explorer](https://explorer.open-campus-codex.gelato.digital)

#### Development Tools
- **Hardhat** - Ethereum development environment
- **Solidity 0.8.28** - Smart contract programming language
- **OpenZeppelin** - Secure smart contract libraries
- **Ethers.js** - Ethereum library for JavaScript

#### Contract Standards
- **ERC-721** - Non-fungible token standard
- **ERC-721URIStorage** - Extended storage for token metadata

---

## 📁 Project Structure

```
client/contracts/
├── contracts/              # Smart contract source files
│   ├── MintellectNFT.sol   # Main NFT contract
│   └── Lock.sol            # Example contract
├── scripts/                # Deployment and utility scripts
│   ├── deploy.js           # Main deployment script
│   └── test-deploy.js      # Test deployment script
├── test/                   # Contract tests
│   └── Lock.js             # Example test file
├── ignition/               # Hardhat Ignition deployment
│   └── modules/
│       └── Lock.js         # Ignition deployment module
├── hardhat.config.js       # Hardhat configuration
├── package.json            # Dependencies
├── package-lock.json       # Lock file
└── README.md               # Contract documentation
```

---

## 🔧 Smart Contract Architecture

### MintellectNFT Contract

The main NFT contract for minting research papers:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MintellectNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    constructor() ERC721("MintellectNFT", "MINT") {
        tokenCounter = 0;
    }

    function mintNFT(address to, string memory tokenURI) public returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter += 1;
        return newTokenId;
    }
}
```

#### Contract Features

**Inheritance:**
- `ERC721` - Base NFT functionality
- `ERC721URIStorage` - Token URI storage extension

**State Variables:**
- `tokenCounter` - Tracks total number of minted tokens

**Functions:**
- `mintNFT(address to, string memory tokenURI)` - Mints new NFT with metadata URI

**Events:**
- `Transfer` - Emitted when tokens are transferred
- `Approval` - Emitted when approval is granted
- `ApprovalForAll` - Emitted when operator approval is granted

---

## 🚀 Deployment Configuration

### Hardhat Configuration (`hardhat.config.js`)

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    educhain: {
      url: "https://rpc.open-campus-codex.gelato.digital",
      chainId: 656476,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      chainId: 31337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
```

### Environment Variables
```bash
# .env file
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

---

## 🔄 Deployment Process

### Deployment Script (`scripts/deploy.js`)

```javascript
async function main() {
  try {
    const hre = require("hardhat");
    
    // Validate environment
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

    // Deploy MintellectNFT contract
    const MintellectNFT = await hre.ethers.getContractFactory("MintellectNFT");
    const contract = await MintellectNFT.deploy();
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    console.log("MintellectNFT deployed to:", contractAddress);
    
    // Verify deployment
    const tokenCounter = await contract.tokenCounter();
    console.log("Initial token counter:", tokenCounter.toString());
    
    return {
      contractAddress,
      deployer: deployer.address,
      network: hre.network.name
    };
    
  } catch (err) {
    console.error("[DEPLOY ERROR]", err);
    if (err.stack) {
      console.error("[STACK TRACE]", err.stack);
    }
    process.exitCode = 1;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Deployment Commands

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to Educhain testnet
npx hardhat run scripts/deploy.js --network educhain

# Deploy to local network
npx hardhat run scripts/deploy.js --network hardhat

# Run tests
npx hardhat test

# Clean artifacts
npx hardhat clean
```

---

## 📊 Contract ABI

### MintellectNFT ABI (`lib/MintellectNFT_ABI.json`)

The Application Binary Interface (ABI) defines the contract's public interface:

```json
[
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mintNFT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
```

---

## 🔗 Frontend Integration

### Contract Interaction Service

```typescript
// lib/contractService.ts
import { ethers } from 'ethers';
import MintellectNFT_ABI from './MintellectNFT_ABI.json';

export class ContractService {
  private contract: ethers.Contract;
  private provider: ethers.Provider;
  private signer: ethers.Signer;

  constructor(contractAddress: string, signer: ethers.Signer) {
    this.signer = signer;
    this.provider = signer.provider!;
    this.contract = new ethers.Contract(
      contractAddress,
      MintellectNFT_ABI,
      signer
    );
  }

  async mintNFT(to: string, tokenURI: string): Promise<number> {
    try {
      const tx = await this.contract.mintNFT(to, tokenURI);
      const receipt = await tx.wait();
      
      // Get the minted token ID from events
      const transferEvent = receipt.logs.find(
        (log: any) => log.eventName === 'Transfer'
      );
      
      if (transferEvent) {
        return transferEvent.args.tokenId.toNumber();
      }
      
      throw new Error('Transfer event not found in transaction receipt');
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  async getTokenCounter(): Promise<number> {
    try {
      const counter = await this.contract.tokenCounter();
      return counter.toNumber();
    } catch (error) {
      console.error('Error getting token counter:', error);
      throw error;
    }
  }

  async getTokenURI(tokenId: number): Promise<string> {
    try {
      return await this.contract.tokenURI(tokenId);
    } catch (error) {
      console.error('Error getting token URI:', error);
      throw error;
    }
  }

  async getOwnerOf(tokenId: number): Promise<string> {
    try {
      return await this.contract.ownerOf(tokenId);
    } catch (error) {
      console.error('Error getting token owner:', error);
      throw error;
    }
  }

  async getBalanceOf(address: string): Promise<number> {
    try {
      const balance = await this.contract.balanceOf(address);
      return balance.toNumber();
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async approve(to: string, tokenId: number): Promise<void> {
    try {
      const tx = await this.contract.approve(to, tokenId);
      await tx.wait();
    } catch (error) {
      console.error('Error approving token:', error);
      throw error;
    }
  }

  async transferFrom(from: string, to: string, tokenId: number): Promise<void> {
    try {
      const tx = await this.contract.transferFrom(from, to, tokenId);
      await tx.wait();
    } catch (error) {
      console.error('Error transferring token:', error);
      throw error;
    }
  }
}
```

### React Hook for Contract Interaction

```typescript
// hooks/useContract.ts
import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { ContractService } from '@/lib/contractService';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export function useContract() {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [contractService, setContractService] = useState<ContractService | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (signer && CONTRACT_ADDRESS) {
      setContractService(new ContractService(CONTRACT_ADDRESS, signer));
    }
  }, [signer]);

  const mintNFT = useCallback(async (tokenURI: string) => {
    if (!contractService || !address) {
      throw new Error('Contract service or address not available');
    }

    setLoading(true);
    setError(null);

    try {
      const tokenId = await contractService.mintNFT(address, tokenURI);
      return tokenId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contractService, address]);

  const getTokenCounter = useCallback(async () => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    return await contractService.getTokenCounter();
  }, [contractService]);

  const getTokenURI = useCallback(async (tokenId: number) => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    return await contractService.getTokenURI(tokenId);
  }, [contractService]);

  const getOwnerOf = useCallback(async (tokenId: number) => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    return await contractService.getOwnerOf(tokenId);
  }, [contractService]);

  const getBalanceOf = useCallback(async (address: string) => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    return await contractService.getBalanceOf(address);
  }, [contractService]);

  return {
    contractService,
    loading,
    error,
    mintNFT,
    getTokenCounter,
    getTokenURI,
    getOwnerOf,
    getBalanceOf
  };
}
```

### NFT Minting Component

```typescript
// components/nft-minting.tsx
import { useState } from 'react';
import { useContract } from '@/hooks/useContract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function NFTMinting() {
  const { mintNFT, loading, error } = useContract();
  const [tokenURI, setTokenURI] = useState('');
  const { toast } = useToast();

  const handleMint = async () => {
    if (!tokenURI.trim()) {
      toast({
        title: "Error",
        description: "Please enter a token URI",
        variant: "destructive"
      });
      return;
    }

    try {
      const tokenId = await mintNFT(tokenURI);
      toast({
        title: "Success",
        description: `NFT minted successfully! Token ID: ${tokenId}`,
      });
      setTokenURI('');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mint Research NFT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="tokenURI" className="block text-sm font-medium mb-2">
            Token URI (IPFS/Arweave)
          </label>
          <Input
            id="tokenURI"
            type="text"
            placeholder="ipfs://Qm..."
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <Button 
          onClick={handleMint} 
          disabled={loading || !tokenURI.trim()}
          className="w-full"
        >
          {loading ? 'Minting...' : 'Mint NFT'}
        </Button>
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 📄 NFT Metadata Structure

### Standard Metadata Format

```json
{
  "name": "Research Paper Title",
  "description": "A comprehensive research paper on [topic]",
  "image": "ipfs://Qm...",
  "external_url": "https://mintellect.xyz/papers/[id]",
  "attributes": [
    {
      "trait_type": "Trust Score",
      "value": 85,
      "max_value": 100
    },
    {
      "trait_type": "Plagiarism Score",
      "value": 92,
      "max_value": 100
    },
    {
      "trait_type": "Research Field",
      "value": "Computer Science"
    },
    {
      "trait_type": "Publication Date",
      "value": "2025-01-31"
    },
    {
      "trait_type": "Verification Status",
      "value": "Verified"
    },
    {
      "trait_type": "Peer Review Score",
      "value": 4.5,
      "max_value": 5
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "ipfs://Qm...",
        "type": "application/pdf"
      }
    ],
    "category": "Research Paper",
    "authors": [
      {
        "name": "Dr. John Doe",
        "institution": "University of Technology",
        "orcid": "0000-0000-0000-0000"
      }
    ],
    "citations": [
      {
        "title": "Related Research Paper",
        "doi": "10.1000/example",
        "url": "https://doi.org/10.1000/example"
      }
    ],
    "verification": {
      "verified_by": "Mintellect AI",
      "verification_date": "2025-01-31T12:00:00Z",
      "verification_method": "AI + Human Review",
      "certificate_url": "ipfs://Qm..."
    }
  }
}
```

### Metadata Generation Service

```typescript
// lib/metadataService.ts
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    max_value?: number;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
    category: string;
    authors: Array<{
      name: string;
      institution: string;
      orcid?: string;
    }>;
    citations?: Array<{
      title: string;
      doi?: string;
      url?: string;
    }>;
    verification: {
      verified_by: string;
      verification_date: string;
      verification_method: string;
      certificate_url?: string;
    };
  };
}

export class MetadataService {
  static generateMetadata(data: {
    title: string;
    description: string;
    imageUri: string;
    trustScore: number;
    plagiarismScore: number;
    researchField: string;
    authors: Array<{ name: string; institution: string; orcid?: string }>;
    fileUri: string;
    verificationData: any;
  }): NFTMetadata {
    return {
      name: data.title,
      description: data.description,
      image: data.imageUri,
      external_url: `https://mintellect.xyz/papers/${Date.now()}`,
      attributes: [
        {
          trait_type: "Trust Score",
          value: data.trustScore,
          max_value: 100
        },
        {
          trait_type: "Plagiarism Score",
          value: data.plagiarismScore,
          max_value: 100
        },
        {
          trait_type: "Research Field",
          value: data.researchField
        },
        {
          trait_type: "Publication Date",
          value: new Date().toISOString().split('T')[0]
        },
        {
          trait_type: "Verification Status",
          value: "Verified"
        }
      ],
      properties: {
        files: [
          {
            uri: data.fileUri,
            type: "application/pdf"
          }
        ],
        category: "Research Paper",
        authors: data.authors,
        verification: {
          verified_by: "Mintellect AI",
          verification_date: new Date().toISOString(),
          verification_method: "AI + Human Review",
          certificate_url: data.verificationData.certificateUrl
        }
      }
    };
  }

  static async uploadToIPFS(metadata: NFTMetadata): Promise<string> {
    // Implementation for IPFS upload
    // This would typically use a service like Pinata or Infura
    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    const result = await response.json();
    return result.ipfsHash;
  }
}
```

---

## 🧪 Testing

### Contract Tests

```javascript
// test/MintellectNFT.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MintellectNFT", function () {
  let MintellectNFT;
  let mintellectNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    MintellectNFT = await ethers.getContractFactory("MintellectNFT");
    mintellectNFT = await MintellectNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mintellectNFT.owner()).to.equal(owner.address);
    });

    it("Should start with token counter at 0", async function () {
      expect(await mintellectNFT.tokenCounter()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint NFT with correct token ID", async function () {
      const tokenURI = "ipfs://QmTest";
      await mintellectNFT.mintNFT(addr1.address, tokenURI);
      
      expect(await mintellectNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await mintellectNFT.tokenURI(0)).to.equal(tokenURI);
      expect(await mintellectNFT.tokenCounter()).to.equal(1);
    });

    it("Should increment token counter correctly", async function () {
      await mintellectNFT.mintNFT(addr1.address, "ipfs://Qm1");
      await mintellectNFT.mintNFT(addr2.address, "ipfs://Qm2");
      
      expect(await mintellectNFT.tokenCounter()).to.equal(2);
    });

    it("Should emit Transfer event on mint", async function () {
      const tokenURI = "ipfs://QmTest";
      await expect(mintellectNFT.mintNFT(addr1.address, tokenURI))
        .to.emit(mintellectNFT, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 0);
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      const tokenURI = "ipfs://QmTest";
      await mintellectNFT.mintNFT(addr1.address, tokenURI);
      
      expect(await mintellectNFT.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should revert for non-existent token", async function () {
      await expect(mintellectNFT.tokenURI(999))
        .to.be.revertedWith("ERC721: invalid token ID");
    });
  });
});
```

### Test Commands

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/MintellectNFT.js

# Run tests with coverage
npx hardhat coverage

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test
```

---

## 🔐 Security Considerations

### Access Control

```solidity
// Enhanced MintellectNFT with access control
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MintellectNFT is ERC721URIStorage, Ownable, Pausable {
    uint256 public tokenCounter;
    mapping(address => bool) public authorizedMinters;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);

    constructor() ERC721("MintellectNFT", "MINT") {
        tokenCounter = 0;
    }

    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }

    function mintNFT(address to, string memory tokenURI) 
        public 
        onlyAuthorizedMinter 
        whenNotPaused 
        returns (uint256) 
    {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");

        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter += 1;

        emit NFTMinted(to, newTokenId, tokenURI);
        return newTokenId;
    }

    function authorizeMinter(address minter) public onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    function revokeMinter(address minter) public onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
}
```

### Reentrancy Protection

```solidity
// Reentrancy guard for external calls
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MintellectNFT is ERC721URIStorage, Ownable, Pausable, ReentrancyGuard {
    // ... existing code ...

    function mintNFT(address to, string memory tokenURI) 
        public 
        onlyAuthorizedMinter 
        whenNotPaused 
        nonReentrant
        returns (uint256) 
    {
        // ... minting logic ...
    }
}
```

---

## 📊 Gas Optimization

### Gas-Efficient Contract

```solidity
// Gas-optimized version
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintellectNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenCounter;
    
    // Pack related data into single storage slot
    struct MintData {
        uint128 tokenId;
        uint128 timestamp;
    }
    
    mapping(uint256 => MintData) private _mintData;

    constructor() ERC721("MintellectNFT", "MINT") {}

    function mintNFT(address to, string calldata tokenURI) 
        external 
        onlyOwner 
        returns (uint256) 
    {
        uint256 tokenId = _tokenCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        _mintData[tokenId] = MintData({
            tokenId: uint128(tokenId),
            timestamp: uint128(block.timestamp)
        });
        
        return tokenId;
    }

    function tokenCounter() external view returns (uint256) {
        return _tokenCounter;
    }

    function getMintData(uint256 tokenId) external view returns (MintData memory) {
        return _mintData[tokenId];
    }
}
```

### Gas Estimation

```typescript
// Gas estimation utility
export class GasEstimator {
  static async estimateMintGas(
    contract: ethers.Contract,
    to: string,
    tokenURI: string
  ): Promise<bigint> {
    try {
      const gasEstimate = await contract.mintNFT.estimateGas(to, tokenURI);
      return gasEstimate;
    } catch (error) {
      console.error('Gas estimation failed:', error);
      throw error;
    }
  }

  static async getGasPrice(provider: ethers.Provider): Promise<bigint> {
    return await provider.getFeeData().then(feeData => feeData.gasPrice || 0n);
  }

  static calculateTotalCost(gasEstimate: bigint, gasPrice: bigint): bigint {
    return gasEstimate * gasPrice;
  }
}
```

---

## 🔄 Contract Upgrades

### Upgradeable Contract Pattern

```solidity
// Upgradeable MintellectNFT using OpenZeppelin Upgrades
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MintellectNFT is 
    Initializable, 
    ERC721URIStorageUpgradeable, 
    OwnableUpgradeable, 
    UUPSUpgradeable 
{
    uint256 public tokenCounter;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC721_init("MintellectNFT", "MINT");
        __ERC721URIStorage_init();
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    function mintNFT(address to, string memory tokenURI) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter += 1;
        return newTokenId;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
```

### Upgrade Script

```javascript
// scripts/upgrade.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const MintellectNFTV2 = await ethers.getContractFactory("MintellectNFTV2");
  
  // Address of the proxy contract
  const proxyAddress = "0x..."; // Your deployed proxy address
  
  console.log("Upgrading MintellectNFT...");
  
  const upgraded = await upgrades.upgradeProxy(proxyAddress, MintellectNFTV2);
  await upgraded.waitForDeployment();
  
  console.log("MintellectNFT upgraded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## 📈 Monitoring & Analytics

### Contract Events Monitoring

```typescript
// Event monitoring service
export class ContractMonitor {
  private contract: ethers.Contract;
  private provider: ethers.Provider;

  constructor(contractAddress: string, provider: ethers.Provider) {
    this.provider = provider;
    this.contract = new ethers.Contract(
      contractAddress,
      MintellectNFT_ABI,
      provider
    );
  }

  async getMintEvents(fromBlock: number, toBlock: number = 'latest') {
    const filter = this.contract.filters.Transfer(ethers.ZeroAddress);
    const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
    
    return events.map(event => ({
      tokenId: event.args.tokenId.toNumber(),
      to: event.args.to,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    }));
  }

  async getTokenMintData(tokenId: number) {
    const owner = await this.contract.ownerOf(tokenId);
    const tokenURI = await this.contract.tokenURI(tokenId);
    
    return {
      tokenId,
      owner,
      tokenURI
    };
  }

  async getContractStats() {
    const tokenCounter = await this.contract.tokenCounter();
    
    return {
      totalTokens: tokenCounter.toNumber(),
      lastUpdated: new Date().toISOString()
    };
  }
}
```

---

*This smart contracts documentation provides a comprehensive overview of the Mintellect blockchain infrastructure. For specific implementation details, refer to the individual contract files.* 