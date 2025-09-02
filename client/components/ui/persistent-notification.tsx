"use client"

import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { Wallet, X, AlertTriangle } from 'lucide-react';

interface PersistentNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function PersistentNotification({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: PersistentNotificationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close after 30 seconds
  useEffect(() => {
    if (isOpen && mounted) {
      const timer = setTimeout(() => {
        onClose();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, mounted]);

  if (!mounted || !isOpen) return null;

  console.log('PersistentNotification: Rendering notification with isOpen:', isOpen);
  console.log('PersistentNotification: Viewport dimensions:', window.innerWidth, 'x', window.innerHeight);
  console.log('PersistentNotification: Document ready state:', document.readyState);

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
        backgroundColor: 'yellow',
        color: 'black',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 100000,
        fontSize: '14px',
        fontWeight: 'bold',
        border: '3px solid black',
        minWidth: '200px',
        textAlign: 'center',
      }}>
        🟡 NOTIFICATION ACTIVE
        <br />
        Window: {window.innerWidth} x {window.innerHeight}
        <br />
        Ready: {document.readyState}
      </div>

      {/* Main notification - using viewport units */}
      <div 
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: 'auto',
          minHeight: '120px',
          zIndex: 99999,
          backgroundColor: 'yellow',
          color: 'black',
          border: '5px solid black',
          padding: '20px',
          fontSize: '18px',
          fontWeight: 'bold',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            {/* Left side - Icon and title */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              flex: '1',
              minWidth: '300px',
            }}>
              <div style={{
                padding: '10px',
                borderRadius: '50%',
                backgroundColor: 'black',
                color: 'yellow',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: 'black',
                  margin: '0 0 8px 0',
                }}>
                  {title}
                </h3>
                <p style={{ 
                  fontSize: '18px', 
                  color: 'black',
                  margin: '0',
                  maxWidth: '500px',
                }}>
                  {description}
                </p>
              </div>
            </div>

            {/* Right side - Buttons */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              flexWrap: 'wrap',
            }}>
              <Button
                variant="outline"
                onClick={onClose}
                style={{
                  backgroundColor: 'black',
                  color: 'yellow',
                  border: '3px solid black',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  minWidth: '120px',
                }}
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  minWidth: '120px',
                  border: 'none',
                }}
              >
                {confirmText}
              </Button>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: 'black',
                  color: 'yellow',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: '3px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{
            marginTop: '20px',
            width: '100%',
            backgroundColor: 'black',
            borderRadius: '10px',
            height: '15px',
            overflow: 'hidden',
          }}>
            <div 
              style={{ 
                width: '100%',
                backgroundColor: 'yellow',
                height: '100%',
                borderRadius: '10px',
                transition: 'width 30s linear',
              }}
            />
          </div>

          {/* Debug text */}
          <div style={{
            marginTop: '15px',
            textAlign: 'center',
            fontSize: '20px',
            color: 'black',
            fontWeight: 'bold',
          }}>
            🟡 PERSISTENT NOTIFICATION - VIEWPORT UNITS - ALWAYS VISIBLE
          </div>
        </div>
      </div>
    </>
  );
}

// Specific notification for wallet disconnection
export function WalletDisconnectNotification({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <PersistentNotification
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
