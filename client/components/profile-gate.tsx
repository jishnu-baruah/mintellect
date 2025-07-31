"use client";

import { AnimatedLogo } from "./ui/animated-logo";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useProfileStatus } from "@/hooks/useProfileChecklist";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from "./ui/button";
import { Wallet, Shield } from "lucide-react";

export function useProfileGate() {
  return useProfileStatus();
}

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const { profileComplete, checking, walletConnected } = useProfileGate();
  const pathname = usePathname();
  const isProfilePage = pathname === "/settings/profile";
  const isWalletTestPage = pathname === "/test-wallet";

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4">
        <AnimatedLogo className="w-20 h-20 mb-2" />
        <span className="text-lg text-gray-400">Checking profile status...</span>
      </div>
    );
  }

  // Check wallet connection first
  if (!walletConnected && !isWalletTestPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <AnimatedLogo className="w-24 h-24 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Welcome to Mintellect
            </h1>
            <p className="text-gray-400 max-w-md text-sm md:text-base">
              AI-Powered Academic Integrity Platform
            </p>
          </div>

          {/* Wallet Connection Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mx-auto mb-4">
              <Wallet className="w-8 h-8 text-blue-400" />
            </div>
            
            <h2 className="text-xl font-bold mb-2 text-white">
              Connect Your Wallet
            </h2>
            
            <p className="text-gray-400 mb-6">
              Connect your wallet to access Mintellect's features and start verifying your academic work.
            </p>

            {/* Wallet Connect Button */}
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
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <Wallet className="w-5 h-5 mr-2" />
                            Connect Wallet
                          </Button>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          <Button
                            onClick={openAccountModal}
                            variant="outline"
                            className="w-full bg-transparent border-gray-600 hover:bg-gray-800 text-white"
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </Button>
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            className="w-full bg-transparent border-gray-600 hover:bg-gray-800 text-white"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Switch Network
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Mobile Troubleshooting */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-white mb-2">Mobile Wallet Tips:</h3>
            <ul className="text-xs text-gray-400 space-y-1 text-left">
              <li>• Make sure your wallet app is installed and open</li>
              <li>• If you see "channel already connected", refresh the page</li>
              <li>• Try disconnecting and reconnecting your wallet</li>
              <li>• Use WalletConnect if other methods fail</li>
            </ul>
          </div>

          {/* Test Wallet Link */}
          <div className="text-center">
            <Link 
              href="/test-wallet" 
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              Having trouble? Test wallet connection →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profileComplete && !isProfilePage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4">
        <AnimatedLogo className="w-20 h-20 mb-2" />
        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Complete Your Profile</h1>
        <p className="mb-2 text-lg font-normal text-gray-200">Please complete your profile to use Mintellect.</p>
        <Link href="/settings/profile" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold border border-mintellect-primary/30 bg-mintellect-primary/10 text-mintellect-primary hover:bg-mintellect-primary/20 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mintellect-primary/40 focus-visible:ring-offset-2 shadow-sm mt-4">
          Go to Profile Settings
        </Link>
      </div>
    );
  }

  // Always render children for /settings/profile and when wallet is connected
  return <>{children}</>;
}
