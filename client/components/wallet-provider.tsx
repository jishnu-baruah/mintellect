"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"

// Add type for window.ethereum and EIP-1193 provider
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (params: any) => void) => void
      removeListener: (event: string, callback: (params: any) => void) => void
      removeAllListeners: () => void
      selectedAddress: string | null
      chainId: string
      isConnected: () => boolean
    }
  }
}

interface WalletContextType {
  walletConnected: boolean
  walletAddress: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  error: string | null
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize provider
  useEffect(() => {
    const initProvider = async () => {
      try {
        // Wait for window.ethereum to be injected
        if (typeof window === 'undefined' || !window.ethereum) {
          setError("No Ethereum wallet found. Please install MetaMask or another Ethereum wallet.")
          return
        }

        console.log("Detected wallet provider:", {
          isMetaMask: window.ethereum.isMetaMask,
          isConnected: window.ethereum.isConnected ? window.ethereum.isConnected() : false,
          selectedAddress: window.ethereum.selectedAddress,
          chainId: window.ethereum.chainId,
        })

        const ethProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(ethProvider)
        setError(null)

        // Check if already connected
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
            params: [],
          })
          
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0])
            setWalletConnected(true)
          }
        } catch (err) {
          console.error("Error checking accounts:", err)
        }
      } catch (err) {
        console.error("Error initializing provider:", err)
        setError("Failed to initialize wallet provider")
      }
    }

    // Add a small delay to ensure window.ethereum is injected
    const timer = setTimeout(initProvider, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Set up event listeners when provider is available
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("Accounts changed:", accounts)
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        setWalletAddress(accounts[0])
        setWalletConnected(true)
      }
    }

    const handleChainChanged = () => {
      console.log("Chain changed")
      window.location.reload()
    }

    const handleConnect = () => {
      console.log("Wallet connected")
      setError(null)
    }

    const handleDisconnect = (error: { code: number; message: string }) => {
      console.log("Wallet disconnected:", error)
      disconnectWallet()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)
    window.ethereum.on("connect", handleConnect)
    window.ethereum.on("disconnect", handleDisconnect)

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
        window.ethereum.removeListener("connect", handleConnect)
        window.ethereum.removeListener("disconnect", handleDisconnect)
      }
    }
  }, [])

  const connectWallet = async () => {
    try {
      setError(null)
      setIsLoading(true)

      if (!window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask or another Ethereum wallet.")
      }

      console.log("Attempting to connect wallet...")

      // Request account access with error handling
      try {
        // First check if the wallet is already connected
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
          params: [],
        })

        console.log("Current accounts:", accounts)

        // If no accounts, request access
        if (!accounts || accounts.length === 0) {
          console.log("Requesting account access...")
          const requestedAccounts = await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [],
          })

          console.log("Requested accounts:", requestedAccounts)

          if (!requestedAccounts || requestedAccounts.length === 0) {
            throw new Error("Please unlock your wallet and try again")
          }

          setWalletAddress(requestedAccounts[0])
          setWalletConnected(true)
        } else {
          setWalletAddress(accounts[0])
          setWalletConnected(true)
        }

        // Initialize provider if not already done
        if (!provider) {
          const ethProvider = new ethers.BrowserProvider(window.ethereum)
          setProvider(ethProvider)
        }

        setError(null)
      } catch (err: any) {
        console.error("Wallet connection error:", err)
        if (err.code === 4001) {
          throw new Error("Please approve the wallet connection request")
        } else if (err.code === -32002) {
          throw new Error("A wallet connection request is already pending. Please check your wallet.")
        } else if (err.message.includes("unlock")) {
          throw new Error("Please open your wallet, unlock it, and try again")
        } else if (err.message.includes("evmAsk")) {
          throw new Error("Please check your wallet extension and try again")
        }
        throw err
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setError(error instanceof Error ? error.message : "Failed to connect wallet")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress("")
    setError(null)
    if (window.ethereum?.removeAllListeners) {
      window.ethereum.removeAllListeners()
    }
  }

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        walletAddress,
        connectWallet,
        disconnectWallet,
        error,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
