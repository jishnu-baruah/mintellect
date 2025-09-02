"use client"

import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { Wallet, X, AlertTriangle } from 'lucide-react';

interface GlobalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function GlobalAlert({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: GlobalAlertProps) {
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

  console.log('GlobalAlert: Rendering alert with isOpen:', isOpen);
  console.log('GlobalAlert: Viewport dimensions:', window.innerWidth, 'x', window.innerHeight);
  console.log('GlobalAlert: Document ready state:', document.readyState);
  console.log('GlobalAlert: Window focus:', document.hasFocus());

  const handleConfirm = () => {
    console.log('GlobalAlert: Confirm clicked');
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    console.log('GlobalAlert: Close clicked');
    onClose();
  };

  return (
    <>
      {/* Floating debug element - always visible */}
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: 'magenta',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          zIndex: 100000,
          fontSize: '16px',
          fontWeight: 'bold',
          border: '4px solid white',
          minWidth: '250px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        }}
        onClick={() => console.log('Debug box clicked')}
      >
        🟣 GLOBAL ALERT ACTIVE
        <br />
        Window: {window.innerWidth} x {window.innerHeight}
        <br />
        Ready: {document.readyState}
        <br />
        Focus: {document.hasFocus() ? 'YES' : 'NO'}
        <br />
        <button 
          onClick={handleClose}
          style={{
            backgroundColor: 'white',
            color: 'magenta',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            marginTop: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          TEST CLOSE
        </button>
      </div>

      {/* Main alert - using absolute positioning */}
      <div 
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: 'auto',
          minHeight: '150px',
          zIndex: 99999,
          backgroundColor: 'magenta',
          color: 'white',
          border: '6px solid white',
          padding: '25px',
          fontSize: '20px',
          fontWeight: 'bold',
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '25px',
          }}>
            {/* Left side - Icon and title */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px',
              flex: '1',
              minWidth: '400px',
            }}>
              <div style={{
                padding: '15px',
                borderRadius: '50%',
                backgroundColor: 'white',
                color: 'magenta',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => console.log('Icon clicked')}
              >
                <AlertTriangle size={40} />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: 'white',
                  margin: '0 0 10px 0',
                }}>
                  {title}
                </h3>
                <p style={{ 
                  fontSize: '20px', 
                  color: 'white',
                  margin: '0',
                  maxWidth: '600px',
                }}>
                  {description}
                </p>
              </div>
            </div>

            {/* Right side - Buttons */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={handleClose}
                style={{
                  backgroundColor: 'white',
                  color: 'magenta',
                  border: '4px solid white',
                  padding: '15px 30px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  minWidth: '140px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'magenta';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'magenta';
                }}
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '15px 30px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  minWidth: '140px',
                  border: '4px solid #dc2626',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                  e.currentTarget.style.borderColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
              >
                {confirmText}
              </button>
              <button
                onClick={handleClose}
                style={{
                  backgroundColor: 'white',
                  color: 'magenta',
                  padding: '15px',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: '4px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'magenta';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'magenta';
                }}
              >
                <X size={28} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{
            marginTop: '25px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '12px',
            height: '20px',
            overflow: 'hidden',
          }}>
            <div 
              style={{ 
                width: '100%',
                backgroundColor: 'magenta',
                height: '100%',
                borderRadius: '12px',
                transition: 'width 60s linear',
              }}
            />
          </div>

          {/* Debug text */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '24px',
            color: 'white',
            fontWeight: 'bold',
          }}>
            🟣 GLOBAL ALERT - ABSOLUTE POSITIONING - CLICK TESTING
          </div>
        </div>
      </div>
    </>
  );
}

// Specific alert for wallet disconnection
export function WalletDisconnectAlert({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <GlobalAlert
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
