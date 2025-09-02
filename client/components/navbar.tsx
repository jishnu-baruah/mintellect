"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/useWallet"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Menu, X, Wallet, User, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { WalletDisconnectBrowserNotification } from "@/components/ui/browser-notification"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)
  const { walletConnected, walletAddress, disconnectWallet } = useWallet()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleDisconnect = () => {
    console.log('Navbar: handleDisconnect called, setting modal to true');
    setShowDisconnectModal(true)
    setIsMenuOpen(false)
  }

  const confirmDisconnect = () => {
    disconnectWallet()
    setShowDisconnectModal(false)
  }

  const handleProfile = () => {
    router.push("/settings/profile")
    setIsMenuOpen(false)
  }

  const handleSettings = () => {
    router.push("/settings")
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-white font-semibold text-lg">Mintellect</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wallet Connection */}
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
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-gray-600 hover:bg-gray-800"
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            Connect Wallet
                          </Button>
                        );
                      }

                      return (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent border-gray-600 hover:bg-gray-800"
                            >
                              <Wallet className="w-4 h-4 mr-2" />
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={openAccountModal}>
                              <User className="w-4 h-4 mr-2" />
                              Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={openChainModal}>
                              <Settings className="w-4 h-4 mr-2" />
                              Switch Network
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleProfile}>
                              <User className="w-4 h-4 mr-2" />
                              Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSettings}>
                              <Settings className="w-4 h-4 mr-2" />
                              App Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDisconnect}>
                              <LogOut className="w-4 h-4 mr-2" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
            onClick={toggleMenu}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/50 backdrop-blur-md rounded-lg mt-2">
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
                              variant="outline"
                              className="w-full bg-transparent border-gray-600 hover:bg-gray-800"
                            >
                              <Wallet className="w-4 h-4 mr-2" />
                              Connect Wallet
                            </Button>
                          );
                        }

                        return (
                          <div className="space-y-2">
                            <Button
                              onClick={openAccountModal}
                              variant="outline"
                              className="w-full bg-transparent border-gray-600 hover:bg-gray-800"
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
                              className="w-full bg-transparent border-gray-600 hover:bg-gray-800"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Switch Network
                            </Button>
                            <Button
                              onClick={handleProfile}
                              variant="outline"
                              className="w-full bg-transparent border-gray-600 hover:bg-gray-800"
                            >
                              <User className="w-4 h-4 mr-2" />
                              Profile Settings
                            </Button>
                            <Button
                              onClick={handleSettings}
                              variant="outline"
                              className="w-full bg-transparent border-gray-600 hover:bg-gray-800"
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              App Settings
                            </Button>
                            <Button
                              onClick={handleDisconnect}
                              variant="outline"
                              className="w-full bg-transparent border-gray-600 hover:bg-gray-800"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Disconnect
                            </Button>
                          </div>
                        );
                      })()}
            </div>
                  );
                }}
              </ConnectButton.Custom>
          </div>
        </div>
      )}
      
      {/* Wallet Disconnect Confirmation Modal */}
      {console.log('Navbar: Modal state:', showDisconnectModal)}
              <WalletDisconnectBrowserNotification
          isOpen={showDisconnectModal}
          onClose={() => setShowDisconnectModal(false)}
          onConfirm={confirmDisconnect}
        />
    </div>
    </nav>
  )
}
