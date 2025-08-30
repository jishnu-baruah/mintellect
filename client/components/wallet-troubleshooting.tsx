"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { RefreshCw, X, AlertTriangle } from "lucide-react";

interface WalletTroubleshootingProps {
  error: string | null;
  onReset: () => void;
  onRetry: () => void;
}

export function WalletTroubleshooting({ error, onReset, onRetry }: WalletTroubleshootingProps) {
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  if (!error) return null;

  const isMetaMaskError = error.includes('Keys not exchanged') || 
                         error.includes('BBB') || 
                         error.includes('channel already connected');

  if (!isMetaMaskError) return null;

  return (
    <div className="space-y-4">
      <Alert className="border-orange-500/20 bg-orange-500/5">
        <AlertTriangle className="h-4 w-4 text-orange-500" />
        <AlertDescription className="text-orange-400">
          {error}
        </AlertDescription>
      </Alert>

      <div className="flex gap-2">
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Reset Connection
        </Button>

        <Button
          onClick={() => setShowTroubleshooting(!showTroubleshooting)}
          variant="ghost"
          size="sm"
        >
          {showTroubleshooting ? 'Hide' : 'Show'} Troubleshooting
        </Button>
      </div>

      {showTroubleshooting && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-white">MetaMask Connection Troubleshooting:</h4>
          <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
            <li>Refresh the page and try connecting again</li>
            <li>Disconnect MetaMask from the site and reconnect</li>
            <li>Clear browser cache and cookies for this site</li>
            <li>Try using a different wallet (Coinbase, WalletConnect)</li>
            <li>Check if MetaMask extension is up to date</li>
            <li>Try disabling other wallet extensions temporarily</li>
            <li>On mobile, try using WalletConnect instead of MetaMask</li>
          </ol>
        </div>
      )}
    </div>
  );
} 