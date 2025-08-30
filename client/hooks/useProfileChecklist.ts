import useSWR from 'swr'
import { useWallet } from '@/hooks/useWallet'
import { profileSWRConfig } from '@/lib/swr-config'
import { LocalStorageCache } from '@/lib/cache-manager'

// Local storage key for checklist cache
const CHECKLIST_CACHE_KEY = 'checklist'

export function useProfileChecklist() {
  const { walletAddress, walletConnected } = useWallet()
  const shouldFetch = walletConnected && walletAddress
  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
  
  // Get cached checklist data from localStorage
  const getCachedChecklist = () => {
    if (typeof window === 'undefined' || !walletAddress) return null
    
    const cacheKey = `${CHECKLIST_CACHE_KEY}-${walletAddress}`
    return LocalStorageCache.get(cacheKey)
  }

  // Set checklist data in localStorage cache
  const setCachedChecklist = (data: any) => {
    if (typeof window === 'undefined' || !walletAddress) return
    
    const cacheKey = `${CHECKLIST_CACHE_KEY}-${walletAddress}`
    LocalStorageCache.set(cacheKey, data)
  }

  const { data, error, isLoading } = useSWR(
    shouldFetch ? [`${API_URL}/settings/profile/requirements`, walletAddress] : null,
    async ([url, wallet]) => {
      const res = await fetch(url, {
        headers: { 'x-wallet': wallet }
      })
      if (!res.ok) throw new Error('Failed to fetch checklist')
      const data = await res.json()
      
      // Cache the successful response
      setCachedChecklist(data)
      return data
    },
    {
      ...profileSWRConfig,
      // Use cached data as fallback
      fallback: getCachedChecklist() ? { [`checklist-${walletAddress}`]: getCachedChecklist() } : undefined,
      // Revalidate on mount only if no cached data
      revalidateOnMount: !getCachedChecklist(),
      // Don't revalidate if we have recent cached data
      revalidateIfStale: !getCachedChecklist(),
    }
  )

  const checklistData = data ?? getCachedChecklist() ?? { checklist: [], allComplete: false }

  return {
    checklist: checklistData.checklist || [],
    allComplete: checklistData.allComplete || false,
    loading: isLoading && !getCachedChecklist(), // Don't show loading if we have cached data
    error,
    isNewUser: data === null && !getCachedChecklist(),
    walletConnected,
    walletAddress,
    // Add cache status for debugging
    isCached: !!getCachedChecklist(),
    // Force refresh function
    refresh: () => {
      const cacheKey = `${CHECKLIST_CACHE_KEY}-${walletAddress}`
      LocalStorageCache.delete(cacheKey)
      // Trigger SWR revalidation
      window.location.reload()
    }
  }
}

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
    error: error
  };
}
