'use client'

import { LoginCallBack, useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authState } = useOCAuth();

  const loginSuccess = () => {
    // Redirect to app.mintellect.xyz with the auth token
    const redirectUrl = `https://app.mintellect.xyz?token=${authState?.accessToken}`;
    window.location.href = redirectUrl;
  };

  const loginError = (error: any) => {
    console.error('Login error:', error);
    router.push('/login?error=authentication_failed');
  };

  function CustomErrorComponent() {
    const { authState } = useOCAuth();
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p className="text-red-400">{authState.error?.message || 'An error occurred during authentication'}</p>
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
          <p>Authenticating...</p>
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

export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mintellect-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
} 