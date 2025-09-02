"use client"

import React from 'react';
import { Button } from './button';
import { Wallet, X } from 'lucide-react';

interface FloatingCardProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function FloatingCard({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: FloatingCardProps) {
  if (!isOpen) return null;

  console.log('FloatingCard: Rendering card with isOpen:', isOpen);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99999]"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
        backgroundColor: 'white',
        border: '5px solid red',
        borderRadius: '10px',
        padding: '20px',
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <Wallet className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-gray-600 text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full sm:flex-1"
        >
          {cancelText}
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirm}
          className="w-full sm:flex-1"
        >
          {confirmText}
        </Button>
      </div>

      {/* Debug text */}
      <div className="mt-4 text-center text-xs text-red-500 font-bold">
        FLOATING CARD - SIMPLE & VISIBLE
      </div>
    </div>
  );
}

// Specific card for wallet disconnection
export function WalletDisconnectCard({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <FloatingCard
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
