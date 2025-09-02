# Wallet Setup Guide

## Overview
The wallet implementation has been updated to use RainbowKit and Wagmi for better mobile and desktop support, with **Educhain-only** configuration.

## ✅ Current Status
- **Educhain Testnet Only** - No other networks supported
- **Mobile + Desktop Support** - Works on all devices
- **Multiple Wallet Support** - MetaMask, Coinbase, WalletConnect, etc.
- **Contract Integration** - Uses Educhain contract for NFT minting

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the `client` directory with:

```env
# WalletConnect Project ID (get one from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=609f45d188c096567677077f5b0b4175

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Educhain Configuration
The app is configured to use **Educhain Testnet only**:

```typescript
const educhainTestnet = {
  id: 656476,
  name: 'Educhain Testnet',
  network: 'educhain',
  nativeCurrency: { decimals: 18, name: 'EDU', symbol: 'EDU' },
  rpcUrls: { default: { http: ['https://rpc.open-campus-codex.gelato.digital'] } },
  blockExplorers: { default: { name: 'Blockscout', url: 'https://edu-chain-testnet.blockscout.com' } },
  testnet: true,
}
```

### 3. Supported Wallets
- **Desktop**: MetaMask, Coinbase Wallet, Rainbow, Trust Wallet, Ledger
- **Mobile**: WalletConnect (works with all mobile wallets)
- **Injected**: Any wallet that injects into the browser

### 4. Features
- ✅ Cross-device compatibility (mobile + desktop)
- ✅ Educhain-only network support
- ✅ Multiple wallet support
- ✅ Network switching (to Educhain)
- ✅ Account management
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

### 5. Testing

#### Test Wallet Connection
1. Visit: `http://localhost:3000/test-wallet`
2. Click "Connect Wallet"
3. Select your preferred wallet
4. Verify Educhain network is selected

#### Test on Different Devices
1. **Desktop**: Chrome, Firefox, Safari with MetaMask
2. **Mobile**: iOS Safari, Android Chrome with WalletConnect
3. **Different Wallets**: MetaMask, Coinbase, Rainbow, etc.

#### Test NFT Minting
1. Complete a workflow
2. Reach the NFT minting step
3. Verify it uses Educhain contract: `0xadB0b68EE8c15b9F9E99ECf9A36a5BF17AC06864`

### 6. Troubleshooting

#### Common Issues
1. **"No wallet found"**: User needs to install a wallet extension
2. **"Wrong network"**: User needs to switch to Educhain Testnet
3. **Connection fails**: Check WalletConnect project ID is correct
4. **Mobile not working**: Ensure WalletConnect project is configured for mobile

#### Debug Steps
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test with different wallets
4. Check network connectivity

## Implementation Details
- ✅ **Web3Providers.tsx**: Educhain-only RainbowKit + Wagmi setup
- ✅ **useWallet.ts**: Updated hook with proper error handling
- ✅ **wallet-connect-button.tsx**: Uses RainbowKit's ConnectButton
- ✅ **navbar.tsx**: Updated with proper wallet management
- ✅ **dashboard-sidebar.tsx**: Updated with wallet connection
- ✅ **NFT minting**: Uses Educhain contract address
- ✅ **Mobile support**: WalletConnect enables mobile wallet connections
- ✅ **Error handling**: Comprehensive error messages and fallbacks

## Migration Notes
- Old `wallet-provider.tsx` is no longer used
- All components now use the new `useWallet` hook
- RainbowKit handles all wallet interactions
- Wagmi provides the underlying Web3 functionality
- **Educhain-only** - No other networks supported 