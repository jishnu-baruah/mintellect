# Mintellect - Wallet Integration Documentation

## 🎯 Wallet Integration Overview

This document provides comprehensive documentation for the Web3 wallet integration in the Mintellect project, including RainbowKit setup, wallet connection logic, and NFT minting functionality.

### 📁 Wallet Structure

```
components/
├── wallet-connect-button.tsx
├── wallet-provider.tsx
├── wallet-test.tsx
├── wallet-troubleshooting.tsx
└── Web3Providers.tsx

hooks/
└── useWallet.ts

lib/
├── MintellectNFT_ABI.json
└── utils.ts
```

---

## 🔧 Web3 Integration Setup

### Dependencies
```json
{
  "dependencies": {
    "@rainbow-me/rainbowkit": "^1.3.0",
    "wagmi": "^1.4.0",
    "ethers": "^6.8.0",
    "viem": "^1.19.0"
  }
}
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x85ab510c1d219e207916a8c8a36a33ce56f3ef6e
NEXT_PUBLIC_CHAIN_ID=656476
NEXT_PUBLIC_RPC_URL=https://rpc.open-campus-codex.gelato.digital
```

---

## 🏗️ Wallet Provider Setup

### Main Wallet Provider
```typescript
// components/wallet-provider.tsx
"use client"

import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig, http } from "wagmi"
import { educhain } from "@/lib/chains"

const { wallets } = getDefaultWallets({
  appName: "Mintellect",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
})

const config = createConfig({
  chains: [educhain],
  transports: {
    [educhain.id]: http(),
  },
})

const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains} wallets={wallets}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Chain Configuration
```typescript
// lib/chains.ts
import { defineChain } from "viem"

export const educhain = defineChain({
  id: 656476,
  name: "EduChain",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.open-campus-codex.gelato.digital"],
    },
    public: {
      http: ["https://rpc.open-campus-codex.gelato.digital"],
    },
  },
  blockExplorers: {
    default: {
      name: "EduChain Explorer",
      url: "https://explorer.open-campus-codex.gelato.digital",
    },
  },
})
```

---

## 🔌 Wallet Connection Components

### Wallet Connect Button
```typescript
// components/wallet-connect-button.tsx
"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

export const WalletConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === "authenticated")

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} type="button">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button" variant="destructive">
                    Wrong network
                  </Button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openChainModal}
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>

                  <Button onClick={openAccountModal} type="button" variant="outline">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
```

### Wallet Test Component
```typescript
// components/wallet-test.tsx
"use client"

import { useState } from "react"
import { useAccount, useBalance, useNetwork } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const WalletTest = () => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { data: balance } = useBalance({
    address,
  })
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      // Test wallet connection
      console.log("Wallet connected:", isConnected)
      console.log("Address:", address)
      console.log("Chain:", chain)
      console.log("Balance:", balance)
    } catch (error) {
      console.error("Connection test failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect your wallet to test the connection.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Address</p>
            <p className="text-sm text-muted-foreground font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Network</p>
            <Badge variant="outline">{chain?.name}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium">Balance</p>
            <p className="text-sm text-muted-foreground">
              {balance?.formatted} {balance?.symbol}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Status</p>
            <Badge variant="default">Connected</Badge>
          </div>
        </div>

        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? "Testing..." : "Test Connection"}
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

## 🪙 NFT Minting Components

### NFT Minting Component
```typescript
// components/nft-minting.tsx
"use client"

import { useState } from "react"
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { MintellectNFT_ABI } from "@/lib/MintellectNFT_ABI"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!

export const NFTMinting = () => {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [tokenURI, setTokenURI] = useState("")
  const [isMinting, setIsMinting] = useState(false)

  const { write: mint, data: mintData } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: MintellectNFT_ABI,
    functionName: "mint",
  })

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
    hash: mintData?.hash,
  })

  const handleMint = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!tokenURI) {
      toast({
        title: "Error",
        description: "Please enter a token URI",
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)
    try {
      mint({
        args: [address, tokenURI],
      })
    } catch (error) {
      console.error("Minting failed:", error)
      toast({
        title: "Error",
        description: "Failed to mint NFT",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mint NFT</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect your wallet to mint an NFT.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint NFT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tokenURI">Token URI</Label>
          <Input
            id="tokenURI"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            placeholder="ipfs://Qm..."
          />
        </div>

        <Button
          onClick={handleMint}
          disabled={isMinting || isConfirming || !tokenURI}
          className="w-full"
        >
          {isMinting || isConfirming ? "Minting..." : "Mint NFT"}
        </Button>

        {isConfirmed && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">
              NFT minted successfully! Transaction hash: {mintData?.hash}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### NFT Gallery Component
```typescript
// components/nft-gallery.tsx
"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image, ExternalLink } from "lucide-react"

interface NFT {
  tokenId: string
  tokenURI: string
  metadata?: {
    name: string
    description: string
    image: string
  }
}

export const NFTGallery = () => {
  const { address, isConnected } = useAccount()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchNFTs = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      // Fetch NFTs from contract
      const response = await fetch(`/api/nfts?address=${address}`)
      const data = await response.json()
      setNfts(data.nfts)
    } catch (error) {
      console.error("Failed to fetch NFTs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchNFTs()
    }
  }, [isConnected, address])

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>NFT Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect your wallet to view your NFTs.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your NFTs</h2>
        <Button onClick={fetchNFTs} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : nfts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No NFTs found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <Card key={nft.tokenId} className="overflow-hidden">
              {nft.metadata?.image && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">
                  {nft.metadata?.name || `NFT #${nft.tokenId}`}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {nft.metadata?.description || "No description"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Token ID: {nft.tokenId}
                  </span>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 🔧 Contract Integration

### Contract ABI
```json
// lib/MintellectNFT_ABI.json
[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "mint",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
]
```

### Contract Utilities
```typescript
// lib/contract-utils.ts
import { ethers } from "ethers"
import MintellectNFT_ABI from "./MintellectNFT_ABI.json"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!

export const getContract = (signer?: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, MintellectNFT_ABI, signer)
}

export const mintNFT = async (address: string, tokenURI: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = getContract(signer)
    
    const tx = await contract.mint(address, tokenURI)
    const receipt = await tx.wait()
    
    // Get the token ID from the Transfer event
    const transferEvent = receipt.logs.find((log: any) => 
      log.fragment?.name === "Transfer"
    )
    
    return transferEvent?.args?.[2]?.toString()
  } catch (error) {
    console.error("Minting failed:", error)
    throw error
  }
}

export const getTokenURI = async (tokenId: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = getContract(provider)
    
    return await contract.tokenURI(tokenId)
  } catch (error) {
    console.error("Failed to get token URI:", error)
    throw error
  }
}

export const getBalance = async (address: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = getContract(provider)
    
    return await contract.balanceOf(address)
  } catch (error) {
    console.error("Failed to get balance:", error)
    throw error
  }
}

export const getOwnerOf = async (tokenId: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = getContract(provider)
    
    return await contract.ownerOf(tokenId)
  } catch (error) {
    console.error("Failed to get owner:", error)
    throw error
  }
}
```

---

## 🔍 Wallet Troubleshooting

### Troubleshooting Component
```typescript
// components/wallet-troubleshooting.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export const WalletTroubleshooting = () => {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<Record<string, boolean>>({})

  const checkWalletConnection = async () => {
    setIsChecking(true)
    const checks: Record<string, boolean> = {}

    try {
      // Check if MetaMask is installed
      checks.metamask = typeof window.ethereum !== "undefined"
      
      // Check if user is connected
      if (checks.metamask) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        checks.connected = accounts.length > 0
      }

      // Check network
      if (checks.connected) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        checks.correctNetwork = chainId === "0xa0c4c" // 656476 in hex
      }

      // Check balance
      if (checks.connected) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        })
        checks.hasBalance = parseInt(balance, 16) > 0
      }

    } catch (error) {
      console.error("Wallet check failed:", error)
    }

    setResults(checks)
    setIsChecking(false)
  }

  const troubleshootingSteps = [
    {
      id: "metamask",
      title: "MetaMask Not Installed",
      description: "Install MetaMask browser extension",
      solution: "Visit metamask.io and install the extension for your browser.",
    },
    {
      id: "connected",
      title: "Wallet Not Connected",
      description: "Connect your wallet to the application",
      solution: "Click the 'Connect Wallet' button and approve the connection in MetaMask.",
    },
    {
      id: "correctNetwork",
      title: "Wrong Network",
      description: "Switch to the correct network",
      solution: "Switch to EduChain network in MetaMask. Network ID: 656476",
    },
    {
      id: "hasBalance",
      title: "Insufficient Balance",
      description: "Add funds to your wallet",
      solution: "You need ETH to pay for transaction fees. Add funds to your wallet.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Troubleshooting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkWalletConnection} disabled={isChecking}>
          {isChecking ? "Checking..." : "Run Diagnostics"}
        </Button>

        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Diagnostic Results</h3>
            
            {troubleshootingSteps.map((step) => (
              <div key={step.id} className="flex items-start space-x-3">
                {results[step.id] ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {!results[step.id] && (
                    <p className="text-sm text-blue-600 mt-1">{step.solution}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Accordion type="single" collapsible>
          <AccordionItem value="common-issues">
            <AccordionTrigger>Common Issues</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Transaction Failed:</strong> Make sure you have enough ETH for gas fees.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Network Error:</strong> Try refreshing the page and reconnecting your wallet.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Permission Denied:</strong> Check if MetaMask is asking for permission and approve it.
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
```

---

## 🔐 Security Considerations

### Transaction Security
```typescript
// lib/security.ts
export const validateTransaction = (tx: any) => {
  // Validate transaction parameters
  if (!tx.to || !tx.value || !tx.gasLimit) {
    throw new Error("Invalid transaction parameters")
  }

  // Check for reasonable gas limit
  if (tx.gasLimit > 5000000) {
    throw new Error("Gas limit too high")
  }

  // Validate recipient address
  if (!/^0x[a-fA-F0-9]{40}$/.test(tx.to)) {
    throw new Error("Invalid recipient address")
  }

  return true
}

export const sanitizeInput = (input: string) => {
  // Remove potentially dangerous characters
  return input.replace(/[<>\"'&]/g, "")
}
```

### Error Handling
```typescript
// lib/error-handling.ts
export const handleWalletError = (error: any) => {
  if (error.code === 4001) {
    return "User rejected the transaction"
  }
  
  if (error.code === -32603) {
    return "Internal JSON-RPC error. Please try again."
  }
  
  if (error.code === -32000) {
    return "Insufficient funds for gas"
  }
  
  if (error.message?.includes("User denied")) {
    return "Transaction was cancelled by user"
  }
  
  return "An unexpected error occurred. Please try again."
}
```

---

## 📱 Mobile Wallet Support

### Mobile Detection
```typescript
// lib/mobile-wallet.ts
export const isMobileWallet = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return (
    userAgent.includes("mobile") ||
    userAgent.includes("android") ||
    userAgent.includes("iphone") ||
    userAgent.includes("ipad")
  )
}

export const getMobileWalletUrl = (address: string) => {
  // Generate deep link for mobile wallets
  return `https://metamask.app.link/dapp/${window.location.host}`
}
```

### Mobile Wallet Connect
```typescript
// components/mobile-wallet-connect.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { isMobileWallet, getMobileWalletUrl } from "@/lib/mobile-wallet"

export const MobileWalletConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleMobileConnect = async () => {
    setIsConnecting(true)
    
    try {
      if (isMobileWallet()) {
        const mobileUrl = getMobileWalletUrl("")
        window.location.href = mobileUrl
      } else {
        // Fallback to desktop connection
        // Implementation here
      }
    } catch (error) {
      console.error("Mobile connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button onClick={handleMobileConnect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Mobile Wallet"}
    </Button>
  )
}
```

---

## 🧪 Testing Wallet Integration

### Test Utilities
```typescript
// lib/test-wallet.ts
export const mockWallet = {
  address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  privateKey: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  balance: "1000000000000000000", // 1 ETH
}

export const createMockProvider = () => {
  return {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  }
}

export const createMockSigner = () => {
  return {
    getAddress: jest.fn().mockResolvedValue(mockWallet.address),
    signMessage: jest.fn(),
    signTransaction: jest.fn(),
  }
}
```

### Integration Tests
```typescript
// __tests__/wallet-integration.test.ts
import { render, screen, fireEvent } from "@testing-library/react"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { WalletProvider } from "@/components/wallet-provider"

describe("Wallet Integration", () => {
  it("shows connect button when wallet is not connected", () => {
    render(
      <WalletProvider>
        <WalletConnectButton />
      </WalletProvider>
    )
    
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument()
  })

  it("handles wallet connection", async () => {
    // Mock wallet connection
    const mockRequest = jest.fn().mockResolvedValue(["0x123..."])
    window.ethereum = { request: mockRequest }
    
    render(
      <WalletProvider>
        <WalletConnectButton />
      </WalletProvider>
    )
    
    fireEvent.click(screen.getByText("Connect Wallet"))
    
    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_requestAccounts",
    })
  })
})
```

---

*This wallet integration documentation provides comprehensive coverage of all wallet-related functionality in the Mintellect project. For specific implementation details, refer to the individual component and utility files.* 