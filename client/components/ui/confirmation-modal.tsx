import React from 'react';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { AlertTriangle, Wallet } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon = <AlertTriangle className="h-6 w-6" />,
}: ConfirmationModalProps) {
  const [isClient, setIsClient] = React.useState(false);
  
  // Ensure we're on the client side
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Prevent body scroll when modal is open on mobile
  React.useEffect(() => {
    // Check if we're in the browser environment
    if (typeof document === 'undefined') return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Ensure modal is visible by forcing focus
      const modalElement = document.querySelector('[data-radix-dialog-content]');
      if (modalElement) {
        (modalElement as HTMLElement).focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Additional positioning logic for edge cases
  const getModalPosition = () => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return {
        width: '400px',
        height: 'auto',
        maxHeight: '500px',
      };
    }
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Ensure modal is always within viewport bounds
    const maxWidth = Math.min(425, viewportWidth - 32);
    const maxHeight = Math.min(600, viewportHeight - 32);
    
    return {
      width: `${maxWidth}px`,
      height: 'auto',
      maxHeight: `${maxHeight}px`,
    };
  };

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Custom backdrop for better visibility */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[9998]"
          style={{ zIndex: 9998 }}
        />
      )}
      <DialogContent 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] p-4 sm:p-6 overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-2xl border"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          ...getModalPosition(),
        }}
      >
        <DialogHeader className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3">
            <div className={`p-2 rounded-full self-start sm:self-center flex-shrink-0 ${
              variant === 'destructive' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {icon}
            </div>
            <DialogTitle className="text-left text-lg sm:text-xl break-words">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left text-gray-600 text-sm sm:text-base leading-relaxed break-words">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:flex-1 order-2 sm:order-1 h-11 sm:h-10"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            className="w-full sm:flex-1 order-1 sm:order-2 h-11 sm:h-10"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Disconnect Wallet"
      description="Are you sure you want to disconnect your wallet? You'll need to reconnect to access your account and continue using the app."
      confirmText="Disconnect"
      cancelText="Keep Connected"
      variant="destructive"
      icon={<Wallet className="h-6 w-6" />}
    />
  );
}
