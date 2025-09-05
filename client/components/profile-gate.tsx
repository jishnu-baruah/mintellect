"use client";

import { usePathname, useRouter } from "next/navigation";
import { AnimatedLogo } from "./ui/animated-logo";
import { useProfileStatus } from "@/hooks/useProfileStatus";
import { useUser } from "@/lib/user-context";
import { ClientOnly } from "./ui/client-only";
import { useWallet } from "@/hooks/useWallet";
import Link from "next/link";

function useProfileGateLogic() {
  const { profileComplete, checking, walletConnected, isCached } = useProfileStatus();
  const { state } = useUser();
  
  // Use cached data if available to avoid loading states
  const isProfileComplete = profileComplete ?? state.profile?.allComplete ?? false;
  const isLoading = checking && !isCached && !state.profile;
  
  return {
    profileComplete: isProfileComplete,
    checking: isLoading,
    walletConnected,
    isCached: isCached || !!state.profile
  };
}

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const { profileComplete, checking, walletConnected, isCached } = useProfileGateLogic();
  const { connectWallet } = useWallet();
  const pathname = usePathname();
  const router = useRouter();
  const isProfilePage = pathname === "/settings/profile";
  const isWalletTestPage = pathname === "/test-wallet";
  const isDevMode = process.env.NODE_ENV === 'development';

  // Show cached content immediately if available
  if (isCached && !checking) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4">
        <AnimatedLogo className="w-20 h-20 mb-2" />
        <span className="text-lg text-gray-400">Checking profile status...</span>
      </div>
    );
  }

  // Check wallet connection first
  if (!walletConnected && !isWalletTestPage) {
    return (
      <ClientOnly>
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4">
        <div className="max-w-md mx-auto">
          {/* Logo */}
            <AnimatedLogo className="w-20 h-20 mx-auto mb-6" />
            
            {/* Title */}
            <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Welcome to Mintellect
            </h1>
            <p className="text-gray-400 mb-6">
              Connect your wallet to access the full research verification platform.
            </p>


            {/* Connect Wallet Button */}
            <button
              onClick={connectWallet}
              className="w-full bg-mintellect-primary hover:bg-mintellect-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>

            {/* Dev Mode Test Wallet Link */}
            {isDevMode && (
              <div className="mt-4 text-center">
                <Link 
                  href="/test-wallet"
                  className="text-sm text-gray-500 hover:text-gray-400 underline"
                >
                  Test Wallet Page (Dev Mode Only)
                </Link>
              </div>
            )}
          </div>
        </div>
      </ClientOnly>
    );
  }

  // Check profile completion
  if (!profileComplete && !isProfilePage && !isWalletTestPage) {
    return (
      <ClientOnly>
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-foreground text-center px-4">
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <AnimatedLogo className="w-20 h-20 mx-auto mb-6" />
            
            {/* Title */}
            <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Complete Your Profile
            </h1>
            <p className="text-gray-400 mb-6">
              Set up your profile to unlock the full Mintellect experience.
            </p>


            {/* Complete Profile Button */}
            <button
              onClick={() => {
                router.push("/settings/profile")
              }}
              className="w-full bg-mintellect-primary hover:bg-mintellect-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Complete Profile
            </button>
          </div>
      </div>
      </ClientOnly>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}
