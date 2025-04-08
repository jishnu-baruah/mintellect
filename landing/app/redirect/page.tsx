'use client'

import { LoginCallBack, useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectPage() {
  const router = useRouter();
  const { authState, ocAuth } = useOCAuth();

  useEffect(() => {
    // Log the current auth state for debugging
    console.log('Current auth state:', authState);
    
    // If there's an error in the auth state, redirect to login with error
    if (authState?.error) {
      console.error('Auth state error:', authState.error);
      router.push('/login?error=authentication_failed');
    }

    // Check if auth state is initialized but missing critical data
    if (authState && (!authState.accessToken || !authState.OCId)) {
      console.error('Auth state missing critical data:', authState);
      router.push('/login?error=authentication_failed');
    }
  }, [authState, router]);

  const loginSuccess = () => {
    try {
      // Log the successful auth state
      console.log('Login successful, auth state:', authState);
      
      if (!authState) {
        throw new Error('Auth state is undefined');
      }
      
      if (!authState.accessToken || !authState.OCId) {
        throw new Error('Missing required authentication data');
      }
      
      // Redirect to app.mintellect.xyz with the auth token and OCID
      const redirectUrl = `https://app.mintellect.xyz?token=${authState.accessToken}&ocid=${authState.OCId}`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error in loginSuccess:', error);
      router.push('/login?error=authentication_failed');
    }
  };

  const loginError = (error: any) => {
    console.error('Login error details:', error);
    console.error('Auth state at error:', authState);
    
    // Handle undefined error
    const errorMessage = error ? 
      (typeof error === 'string' ? error : error.message) : 
      'Authentication failed';
    
    console.error('Formatted error message:', errorMessage);
    router.push('/login?error=authentication_failed');
  };

  function CustomErrorComponent() {
    const { authState } = useOCAuth();
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p className="text-red-400 mb-4">
            {authState?.error?.message || 'An error occurred during authentication. Please try again.'}
          </p>
          <p className="text-gray-400 text-sm mb-4">Please try connecting your OCID again</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-mintellect-primary text-white rounded-lg hover:bg-mintellect-primary/80 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  function CustomLoadingComponent() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mintellect-primary mx-auto mb-4"></div>
          <p>Authenticating with OCID...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  return (
    <LoginCallBack
      errorCallback={loginError}
      successCallback={loginSuccess}
      customErrorComponent={<CustomErrorComponent />}
      customLoadingComponent={<CustomLoadingComponent />}
    />
  );
} 