"use client";
"use client";
import { useWallet } from "./wallet-provider";
import { AnimatedLogo } from "./ui/animated-logo";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { isMobileDevice } from './wallet-provider';

export function useProfileGate() {
  const { walletConnected, walletAddress } = useWallet();
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!walletConnected || !walletAddress) {
      setProfileComplete(null);
      setChecking(false);
      return;
    }
    // Check cache first
    const cacheKey = `profileComplete_${walletAddress}`;
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
    if (cached !== null) {
      setProfileComplete(cached === 'true');
      setChecking(false);
    } else {
      setChecking(true);
    }
    // Always fetch in background
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/profile/profile?wallet=${walletAddress}&_=${Date.now()}`)
      .then(res => {
        if (res.status === 404) return { allComplete: false };
        return res.json();
      })
      .then(data => {
        setProfileComplete(data.allComplete);
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, String(data.allComplete));
        }
        setChecking(false);
      })
      .catch(() => {
        setProfileComplete(false);
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, 'false');
        }
        setChecking(false);
      });
  }, [walletConnected, walletAddress]);

  return { profileComplete, checking, walletConnected, walletAddress };
}

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const { profileComplete, checking, walletConnected, walletAddress } = useProfileGate();
  const { connectWallet, isLoading } = useWallet();
  const { openConnectModal } = useConnectModal();
  const pathname = usePathname();
  const isProfilePage = pathname === "/settings/profile";

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4">
        <AnimatedLogo className="w-20 h-20 mb-2" />
        <span className="text-lg text-gray-400">Checking profile status...</span>
      </div>
    );
  }

  if (!walletConnected || !walletAddress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4 gap-6">
        <AnimatedLogo className="w-20 h-20 mb-2" />
        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Welcome to Mintellect</h1>
        <p className="mb-2 text-lg font-normal text-gray-200">Connect your wallet to use Mintellect.</p>
        <button
          onClick={isMobileDevice() ? openConnectModal : connectWallet}
          disabled={isLoading}
          className="flex items-center gap-2 w-full max-w-[220px] justify-center px-4 py-1.5 rounded-full border border-mintellect-primary shadow-sm bg-mintellect-primary text-white hover:bg-mintellect-primary/80 transition font-medium text-base"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" ry="2" /><path d="M18 12h.01" /></svg>
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }

  if (!profileComplete && !isProfilePage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4">
        <AnimatedLogo className="w-20 h-20 mb-2" />
        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Complete Your Profile</h1>
        <p className="mb-2 text-lg font-normal text-gray-200">Please complete your profile to use Mintellect.</p>
        <Link href="/settings/profile" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold border border-mintellect-primary/30 bg-mintellect-primary/10 text-mintellect-primary hover:bg-mintellect-primary/20 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mintellect-primary/40 focus-visible:ring-offset-2 shadow-sm mt-4">
          Go to Profile Settings
        </Link>
      </div>
    );
  }

  // Always render children for /settings/profile
  return <>{children}</>;
}
