'use client'

import { ReactNode } from 'react';
import { OCConnect } from '@opencampus/ocid-connect-js';

interface OCConnectWrapperProps {
  children: ReactNode;
  opts: {
    clientId?: string;
    redirectUri: string;
    referralCode?: string;
  };
  sandboxMode?: boolean;
}

export default function OCConnectWrapper({ children, opts, sandboxMode = true }: OCConnectWrapperProps) {
  // Ensure we're using the correct configuration for sandbox mode
  const finalOpts = {
    ...opts,
    clientId: sandboxMode ? undefined : opts.clientId, // Don't use clientId in sandbox mode
  };

  return (
    <OCConnect 
      opts={finalOpts} 
      sandboxMode={sandboxMode}
    >
      {children}
    </OCConnect>
  );
} 