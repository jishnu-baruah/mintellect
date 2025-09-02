import useSWR from 'swr'
import { useWallet } from '@/hooks/useWallet'
import { profileSWRConfig } from '@/lib/swr-config'
import { LocalStorageCache } from '@/lib/cache-manager'

// Cache key for profile data
const getProfileCacheKey = (wallet: string) => `profile-${wallet}`

// Local storage key for profile cache
const PROFILE_CACHE_KEY = 'profile'

export function useProfileStatus() {
  const { walletAddress, walletConnected } = useWallet();
  const shouldFetch = walletConnected && walletAddress;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const swr = useSWR(
    shouldFetch ? [`${API_URL}/settings/profile/profile?wallet=${walletAddress}`, walletAddress] : null,
    ([url]) => fetch(url).then(res => res.json()),
    { revalidateOnFocus: false }
  );

  const data = swr?.data ?? {};
  const error = swr?.error ?? null;
  const isLoading = swr?.isLoading ?? false;

  return {
    profileComplete: data.allComplete ?? null,
    checking: isLoading,
    walletConnected: walletConnected ?? false,
    walletAddress: walletAddress ?? "",
    error: error,
    // Add refresh function
    refresh: () => {
      swr.mutate();
    }
  };
}
