"use client"

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/hooks/useWallet'
import { Button } from './ui/button'
import { Wallet, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

interface WalletConnectButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function WalletConnectButton({ 
  className = '', 
  variant = 'default',
  size = 'default'
}: WalletConnectButtonProps) {
  const { walletConnected, isLoading, error } = useWallet()
  const [showError, setShowError] = useState(false)

  // Show error if there's a connection error
  if (error && !showError) {
    setShowError(true)
  }

  if (walletConnected) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={`bg-green-600 hover:bg-green-700 ${className}`}
        disabled
      >
        <Wallet className="w-4 h-4 mr-2" />
        Wallet Connected
      </Button>
    )
  }

  return (
    <div className="space-y-2">
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
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
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
                      disabled={isLoading}
                      variant={variant}
                      size={size}
                      className={className}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wallet className="w-4 h-4 mr-2" />
                      )}
                      {isLoading ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      onClick={openChainModal}
                      variant="destructive"
                      size={size}
                      className={className}
                    >
                      Wrong network
                    </Button>
                  );
                }

                return (
                  <div className="flex gap-2">
                    <Button
                      onClick={openChainModal}
                      variant="outline"
                      size={size}
                      className={className}
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>

                    <Button
                      onClick={openAccountModal}
                      variant={variant}
                      size={size}
                      className={className}
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </Button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      {error && showError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <br />
            <span className="text-sm opacity-80">
              Try using MetaMask or another wallet if Coinbase is not working.
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 