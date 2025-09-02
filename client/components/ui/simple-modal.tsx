"use client"

import React, { useEffect } from 'react';
import { Button } from './button';
import { Wallet, X } from 'lucide-react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function SimpleModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: SimpleModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  console.log('SimpleModal: Rendering modal with isOpen:', isOpen);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-[9998]"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9998,
        }}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red tint for debugging
        }}
      >
        <div 
          className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border max-w-md w-full max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '5px solid red', // Very visible red border for debugging
            maxWidth: '28rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {/* Debug overlay */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '0',
              right: '0',
              backgroundColor: 'red',
              color: 'white',
              padding: '5px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 10000,
            }}>
              DEBUG: MODAL IS RENDERING
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <Wallet className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:flex-1 h-11 sm:h-10 order-2 sm:order-1"
            >
              {cancelText}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="w-full sm:flex-1 h-11 sm:h-10 order-1 sm:order-2"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Specific modal for wallet disconnection
export function WalletDisconnectModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <SimpleModal
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
