"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface WalletContextType {
  walletConnected: boolean;
  walletAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

// Utility to detect mobile
export function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, isConnecting, isReconnecting, status } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const [error, setError] = useState<string | null>(null);
  const { openConnectModal } = useConnectModal();

  // Compose loading state
  const isLoading = isConnecting || isReconnecting;

  // Compose error state with better error handling
  useEffect(() => {
    if (connectError) {
      // Handle specific Coinbase errors
      if (connectError.message.includes('coinbase') || connectError.message.includes('401')) {
        setError('Coinbase wallet connection failed. Please try using MetaMask or another wallet.');
      } else if (connectError.message.includes('User rejected')) {
        setError('Connection was cancelled. Please try again.');
      } else if (connectError.message.includes('No wallet found')) {
        setError('No wallet detected. Please install MetaMask or another wallet extension.');
      } else {
        setError(connectError.message);
      }
    } else {
      setError(null);
    }
  }, [connectError]);

  // Detect if no injected provider and on mobile
  const [showMobileWalletMessage, setShowMobileWalletMessage] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && isMobileDevice()) {
      if (!window.ethereum) {
        setShowMobileWalletMessage(true);
      }
    }
  }, []);

  // Connect wallet handler with improved error handling
  const connectWallet = async () => {
    setError(null);
    try {
      if (connectors.length === 0) {
        setError('No wallet connectors available');
        return;
      }
      
      // Try to connect with the first available connector
      await connect({ connector: connectors[0] });
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      
      // Handle specific error types
      if (err?.message?.includes('coinbase') || err?.message?.includes('401')) {
        setError('Coinbase wallet connection failed. Please try using MetaMask or another wallet.');
      } else if (err?.message?.includes('User rejected')) {
        setError('Connection was cancelled. Please try again.');
      } else if (err?.message?.includes('No wallet found')) {
        setError('No wallet detected. Please install MetaMask or another wallet extension.');
      } else {
        setError(err?.message || 'Failed to connect wallet. Please try again.');
      }
    }
  };

  // Disconnect wallet handler
  const disconnectWallet = () => {
    try {
      disconnect();
      setError(null);
    } catch (err: any) {
      console.error('Wallet disconnect error:', err);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletConnected: !!isConnected,
        walletAddress: address || '',
        connectWallet,
        disconnectWallet,
        error,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
