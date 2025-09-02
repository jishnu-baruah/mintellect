"use client"

import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { Wallet, X, AlertTriangle } from 'lucide-react';

interface SidebarIndependentConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function SidebarIndependentConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: SidebarIndependentConfirmationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close after 45 seconds
  useEffect(() => {
    if (isOpen && mounted) {
      const timer = setTimeout(() => {
        onClose();
      }, 45000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, mounted]);

  if (!mounted || !isOpen) return null;

  console.log('SidebarIndependentConfirmation: Rendering confirmation with isOpen:', isOpen);
  console.log('SidebarIndependentConfirmation: Viewport dimensions:', window.innerWidth, 'x', window.innerHeight);

  const handleConfirm = () => {
    console.log('SidebarIndependentConfirmation: Confirm clicked');
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    console.log('SidebarIndependentConfirmation: Close clicked');
    onClose();
  };

  return (
    <>
      {/* Floating debug element - always visible */}
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px', // Changed to left side to avoid sidebar
          backgroundColor: 'cyan',
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
        🔵 SIDEBAR INDEPENDENT
        <br />
        Window: {window.innerWidth} x {window.innerHeight}
        <br />
        Sidebar State: Independent
        <br />
        <button 
          onClick={handleClose}
          style={{
            backgroundColor: 'black',
            color: 'cyan',
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

      {/* Main confirmation - using viewport-relative positioning */}
      <div 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '600px',
          minHeight: '200px',
          zIndex: 99999,
          backgroundColor: 'cyan',
          color: 'black',
          border: '6px solid black',
          borderRadius: '15px',
          padding: '30px',
          fontSize: '20px',
          fontWeight: 'bold',
          boxSizing: 'border-box',
          overflow: 'visible',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
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
                  color: 'cyan',
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
                  color: 'cyan',
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
                  e.currentTarget.style.backgroundColor = 'cyan';
                  e.currentTarget.style.color = 'black';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'black';
                  e.currentTarget.style.color = 'cyan';
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
                  e.currentTarget.style.borderColor = '#dc2626';
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
                  backgroundColor: 'cyan',
                  height: '100%',
                  borderRadius: '10px',
                  transition: 'width 45s linear',
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
              🔵 SIDEBAR INDEPENDENT - VIEWPORT CENTERED - ALWAYS VISIBLE
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Specific confirmation for wallet disconnection
export function WalletDisconnectConfirmation({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <SidebarIndependentConfirmation
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
