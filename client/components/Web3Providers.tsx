"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultWallets, connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig, createConfig, http } from "wagmi";
import { mainnet, type Chain } from "wagmi/chains";
import '@rainbow-me/rainbowkit/styles.css';

const educhainTestnet: Chain = {
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
};

export const chains = [mainnet, educhainTestnet];

const { connectors } = getDefaultWallets({
  appName: 'Mintellect',
  projectId: '609f45d188c096567677077f5b0b4175',
  chains,
});

const wagmiConfig = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [educhainTestnet.id]: http('https://rpc.open-campus-codex.gelato.digital'),
  },
  autoConnect: true,
});

const queryClient = new QueryClient();

export default function Web3Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
} 