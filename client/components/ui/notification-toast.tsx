"use client"

import React, { useEffect } from 'react';
import { Button } from './button';
import { Wallet, X, AlertTriangle } from 'lucide-react';

interface NotificationToastProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function NotificationToast({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: NotificationToastProps) {
  // Auto-close after 10 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  console.log('NotificationToast: Rendering toast with isOpen:', isOpen);
  console.log('NotificationToast: Document body exists:', !!document.body);
  console.log('NotificationToast: Window dimensions:', window.innerWidth, 'x', window.innerHeight);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Floating debug element - always visible */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'lime',
        color: 'black',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 100000,
        fontSize: '14px',
        fontWeight: 'bold',
        border: '3px solid black',
      }}>
        🟢 TOAST RENDERING: {isOpen ? 'YES' : 'NO'}
      </div>

      {/* Main toast */}
      <div 
        className="fixed top-0 left-0 right-0 z-[99999]"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99999,
          backgroundColor: 'lime',
          color: 'black',
          border: '5px solid black',
          minHeight: '100px',
          padding: '20px',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left side - Icon and title */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-black text-lime">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">{title}</h3>
                <p className="text-base text-black">{description}</p>
              </div>
            </div>

            {/* Right side - Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-black text-lime border-black hover:bg-gray-800"
                style={{
                  backgroundColor: 'black',
                  color: 'lime',
                  border: '2px solid black',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-red-600 text-white hover:bg-red-700"
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {confirmText}
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black hover:text-lime transition-colors"
                style={{
                  backgroundColor: 'black',
                  color: 'lime',
                  padding: '10px',
                  borderRadius: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-black rounded-full h-3">
            <div 
              className="bg-lime h-3 rounded-full transition-all duration-10000 ease-linear"
              style={{ 
                width: '100%',
                backgroundColor: 'lime',
                height: '12px',
                borderRadius: '6px',
              }}
            />
          </div>

          {/* Debug text */}
          <div className="mt-4 text-center text-lg text-black font-bold">
            🟢 NOTIFICATION TOAST - BRIGHT LIME - IMPOSSIBLE TO MISS
          </div>
        </div>
      </div>
    </>
  );
}

// Specific toast for wallet disconnection
export function WalletDisconnectToast({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <NotificationToast
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
