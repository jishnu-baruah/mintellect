"use client"

import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/hooks/useWallet'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Wallet, CheckCircle, XCircle, AlertCircle, Loader2, Smartphone, Monitor } from 'lucide-react'

export function WalletTest() {
  const { walletConnected, walletAddress, error, isLoading } = useWallet()
  const [isMobile, setIsMobile] = useState(false)
  const [userAgent, setUserAgent] = useState('')
  const [testResults, setTestResults] = useState<{
    connection: boolean
    address: boolean
    error: boolean
    loading: boolean
  }>({
    connection: false,
    address: false,
    error: false,
    loading: false
  })

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgentString = navigator.userAgent
      setUserAgent(userAgentString)
      
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      const isMobileDevice = mobileRegex.test(userAgentString)
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
  }, [])

  const runTests = () => {
    setTestResults({
      connection: walletConnected,
      address: !!walletAddress,
      error: !!error,
      loading: isLoading
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connection Test
          </CardTitle>
          <CardDescription>
            Test the new RainbowKit wallet implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Device Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Device Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={isMobile ? "default" : "secondary"}>
                  {isMobile ? (
                    <Smartphone className="w-3 h-3 mr-1" />
                  ) : (
                    <Monitor className="w-3 h-3 mr-1" />
                  )}
                  {isMobile ? 'Mobile Device' : 'Desktop Device'}
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                <strong>User Agent:</strong> {userAgent.substring(0, 100)}...
              </div>
            </div>
      </div>

          {/* RainbowKit Connect Button */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">RainbowKit Connect Button</h3>
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
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700"
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

                      return (
                        <div className="space-y-2">
                          <Button
                            onClick={openAccountModal}
                            variant="outline"
                            className="w-full"
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
              className="w-full"
            >
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

          {/* Custom Hook Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Hook Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={walletConnected ? "default" : "secondary"}>
                  {walletConnected ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {walletConnected ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={walletAddress ? "default" : "secondary"}>
                  {walletAddress ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {walletAddress ? 'Address Available' : 'No Address'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={error ? "destructive" : "secondary"}>
                  {error ? (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {error ? 'Error' : 'No Errors'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isLoading ? "default" : "secondary"}>
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {isLoading ? 'Loading' : 'Not Loading'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Wallet Address Display */}
          {walletAddress && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Wallet Address</h3>
              <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm break-all">
                {walletAddress}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-400">Error</h3>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-400">
                {error}
              </div>
        </div>
      )}

          {/* Test Results */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button onClick={runTests} variant="outline">
                Run Tests
              </Button>
              <span className="text-sm text-gray-400">
                Test the wallet connection status
              </span>
            </div>
            
            {Object.values(testResults).some(Boolean) && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Test Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={testResults.connection ? "default" : "destructive"}>
                      {testResults.connection ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      Connection Test
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={testResults.address ? "default" : "destructive"}>
                      {testResults.address ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      Address Test
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={!testResults.error ? "default" : "destructive"}>
                      {!testResults.error ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      Error Test
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={!testResults.loading ? "default" : "destructive"}>
                      {!testResults.loading ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      Loading Test
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Implementation Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Implementation Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>RainbowKit integrated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Wagmi configured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Mobile support enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Multiple wallet support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Network switching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Error handling</span>
              </div>
            </div>
      </div>
        </CardContent>
      </Card>
    </div>
  )
} 