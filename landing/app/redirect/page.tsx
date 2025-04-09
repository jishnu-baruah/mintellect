'use client'

import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RedirectPage() {
  const router = useRouter();
  const { authState, ocAuth } = useOCAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Log initial auth state
    console.log('Initial auth state:', authState);

    const timer = setTimeout(() => {
      setIsProcessing(false);
      
      // Check if we have valid authentication data
      if (authState?.OCId && authState?.accessToken) {
        console.log('Authentication successful, redirecting...');
        // Redirect to login with both OCID and accessToken
        router.push(`/login?ocid=${authState.OCId}&token=${authState.accessToken}&success=true`);
        return;
      }

      // If we don't have both OCID and accessToken after processing, redirect to login
      if (!isProcessing) {
        console.log('Incomplete authentication data, redirecting to login...');
        router.push('/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [authState, router, isProcessing]);

  // Show loading state while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mintellect-primary mx-auto mb-4"></div>
        <p>Processing authentication...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we verify your credentials</p>
      </div>
    </div>
  );
} 