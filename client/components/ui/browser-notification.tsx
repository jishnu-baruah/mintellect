"use client"

import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { Wallet, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrowserNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function BrowserNotification({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: BrowserNotificationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close after 60 seconds
  useEffect(() => {
    if (isOpen && mounted) {
      const timer = setTimeout(() => {
        onClose();
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, mounted]);

  if (!mounted || !isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Main notification card */}
      <div 
        className={cn(
          "relative w-full max-w-md mx-auto",
          "bg-black/90 backdrop-blur-md border border-mintellect-primary/30",
          "rounded-xl shadow-2xl overflow-hidden",
          "animate-in fade-in-0 zoom-in-95 duration-300"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-mintellect-primary/5 via-transparent to-mintellect-secondary/5" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-mintellect-primary/10 via-mintellect-secondary/10 to-mintellect-accent/10 opacity-50" />
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-mintellect-primary/10 border border-mintellect-primary/30 glow-sm">
                <AlertTriangle className="h-6 w-6 text-mintellect-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                {title}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed text-center">
              {description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white hover:border-mintellect-primary/50 transition-all duration-200"
            >
              {cancelText}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 transition-all duration-200"
            >
              {confirmText}
            </Button>
          </div>

          {/* Auto-close progress bar */}
          <div className="mt-4 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-mintellect-primary to-mintellect-secondary rounded-full transition-all duration-1000 ease-linear"
              style={{ 
                width: '100%',
                animation: 'shrink 60s linear forwards'
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// Specific notification for wallet disconnection
export function WalletDisconnectBrowserNotification({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <BrowserNotification
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Disconnect Wallet"
      description="Are you sure you want to disconnect your wallet? You'll need to reconnect to access your account and continue using the app."
      confirmText="Disconnect"
      cancelText="Keep Connected"
    />
  );
}
