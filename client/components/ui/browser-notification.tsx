"use client"

import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { Wallet, X, AlertTriangle } from 'lucide-react';

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

  console.log('BrowserNotification: Rendering notification with isOpen:', isOpen);
  console.log('BrowserNotification: Viewport dimensions:', window.innerWidth, 'x', window.innerHeight);

  const handleConfirm = () => {
    console.log('BrowserNotification: Confirm clicked');
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    console.log('BrowserNotification: Close clicked');
    onClose();
  };

  return (
    <>
      {/* Floating debug element - always visible */}
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          backgroundColor: 'orange',
          color: 'black',
          padding: '15px',
          borderRadius: '8px',
          zIndex: 100000,
          fontSize: '16px',
          fontWeight: 'bold',
          border: '4px solid black',
          minWidth: '250px',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        }}
        onClick={() => console.log('Debug box clicked')}
      >
        🟠 BROWSER NOTIFICATION
        <br />
        Window: {window.innerWidth} x {window.innerHeight}
        <br />
        Strategy: DOM Independent
        <br />
        <button 
          onClick={handleClose}
          style={{
            backgroundColor: 'black',
            color: 'orange',
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

      {/* Main notification - using different positioning strategy */}
      <div 
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          zIndex: 99999,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={handleClose}
      >
        {/* Notification card */}
        <div 
          style={{
            backgroundColor: 'orange',
            color: 'black',
            border: '6px solid black',
            borderRadius: '15px',
            padding: '30px',
            fontSize: '20px',
            fontWeight: 'bold',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ width: '100%' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '25px',
            }}>
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '20px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'black',
                    color: 'orange',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => console.log('Icon clicked')}
                  >
                    <AlertTriangle size={36} />
                  </div>
                  <h3 style={{ 
                    fontSize: '26px', 
                    fontWeight: 'bold', 
                    color: 'black',
                    margin: '0',
                  }}>
                    {title}
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  style={{
                    backgroundColor: 'black',
                    color: 'orange',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    border: '4px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'orange';
                    e.currentTarget.style.color = 'black';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'black';
                    e.currentTarget.style.color = 'orange';
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div style={{
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                border: '2px solid black',
              }}>
                <p style={{ 
                  fontSize: '18px', 
                  color: 'black',
                  margin: '0',
                  lineHeight: '1.5',
                  textAlign: 'center',
                }}>
                  {description}
                </p>
              </div>

              {/* Buttons */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={handleClose}
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    border: '4px solid black',
                    padding: '15px 30px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    minWidth: '140px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'black';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = 'black';
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
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  {confirmText}
                </button>
              </div>

              {/* Progress bar */}
              <div style={{
                width: '100%',
                backgroundColor: 'black',
                borderRadius: '10px',
                height: '15px',
                overflow: 'hidden',
              }}>
                <div 
                  style={{ 
                    width: '100%',
                    backgroundColor: 'orange',
                    height: '100%',
                    borderRadius: '10px',
                    transition: 'width 60s linear',
                  }}
                />
              </div>

              {/* Debug text */}
              <div style={{
                textAlign: 'center',
                fontSize: '20px',
                color: 'black',
                fontWeight: 'bold',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '8px',
                border: '2px solid black',
              }}>
                🟠 BROWSER NOTIFICATION - FULL SCREEN OVERLAY - CLICK OUTSIDE TO CLOSE
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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
