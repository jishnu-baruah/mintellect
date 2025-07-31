"use client"

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';

// Utility to detect mobile
export function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent);
}

export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [error, setError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Compose loading state
  const isLoading = isConnecting || isReconnecting;

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      console.error('Wagmi connect error:', connectError);
      
      // Handle specific mobile wallet errors
      if (connectError.message.includes('channel already connected')) {
        setError('Connection already active. Please try disconnecting first or refresh the page.');
      } else if (connectError.message.includes('User rejected') || connectError.message.includes('user rejected')) {
        setError('Connection was cancelled. Please try again.');
      } else if (connectError.message.includes('No wallet found')) {
        setError('No wallet detected. Please install a wallet app or use WalletConnect.');
      } else if (connectError.message.includes('Provider not found')) {
        setError('Wallet provider not available. Please try refreshing the page.');
      } else if (connectError.message.includes('coinbase') || connectError.message.includes('401')) {
        setError('Coinbase wallet connection failed. Please try using MetaMask or another wallet.');
      } else if (connectError.message.includes('{}') || connectError.message === '{}') {
        setError('Connection failed. Please try again or use a different wallet.');
      } else if (connectError.message.includes('timeout') || connectError.message.includes('Timeout')) {
        setError('Connection timed out. Please check your internet connection and try again.');
      } else {
        setError(connectError.message || 'Connection failed. Please try again.');
      }
    } else {
      setError(null);
    }
  }, [connectError]);

  // Connect wallet handler using RainbowKit modal
  const connectWallet = async () => {
    setError(null);
    setConnectionAttempts(prev => prev + 1);
    
    try {
      if (openConnectModal) {
        openConnectModal();
      } else {
        setError('Connect modal not available. Please try refreshing the page.');
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      
      // Handle specific mobile errors
      if (err?.message?.includes('channel already connected')) {
        setError('Connection already active. Please try disconnecting first or refresh the page.');
      } else if (err?.message?.includes('{}')) {
        setError('Connection failed. Please try again or use a different wallet.');
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
      setConnectionAttempts(0);
    } catch (err: any) {
      console.error('Wallet disconnect error:', err);
    }
  };

  // Clear error after successful connection
  useEffect(() => {
    if (isConnected && error) {
      setError(null);
      setConnectionAttempts(0);
    }
  }, [isConnected, error]);

  return {
    walletConnected: !!isConnected,
    walletAddress: address || '',
    connectWallet,
    disconnectWallet,
    error,
    isLoading,
    connectionAttempts,
  };
} 