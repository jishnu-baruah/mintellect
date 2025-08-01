"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { createConfig, http } from 'wagmi';

// Educhain Testnet configuration
const educhainTestnet = {
  id: 656476,
  name: 'Educhain Testnet',
  network: 'educhain',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    default: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
    public: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://edu-chain-testnet.blockscout.com' },
  },
  testnet: true,
} as const;

// Configure chains for the app - only Educhain
const chains = [educhainTestnet] as const;

// Set up wagmi config
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '609f45d188c096567677077f5b0b4175';

// Get default wallets (includes mobile wallet detection)
const { connectors } = getDefaultWallets({
  appName: 'Mintellect',
  projectId,
});

const config = createConfig({
  chains,
  connectors,
  transports: {
    [educhainTestnet.id]: http('https://rpc.open-campus-codex.gelato.digital'),
  },
});

// Configure query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export default function Web3Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={educhainTestnet}
          locale="en-US"
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 