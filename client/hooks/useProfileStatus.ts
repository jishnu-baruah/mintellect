import useSWR from 'swr'
import { useWallet } from '@/hooks/useWallet'
import { profileSWRConfig } from '@/lib/swr-config'
import { LocalStorageCache } from '@/lib/cache-manager'

// Cache key for profile data
const getProfileCacheKey = (wallet: string) => `profile-${wallet}`

// Local storage key for profile cache
const PROFILE_CACHE_KEY = 'profile'

export function useProfileStatus() {
  const { walletAddress, walletConnected } = useWallet()
  const shouldFetch = walletConnected && walletAddress
  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
  
  // Get cached profile data from localStorage
  const getCachedProfile = () => {
    if (typeof window === 'undefined' || !walletAddress) return null
    
    const cacheKey = `${PROFILE_CACHE_KEY}-${walletAddress}`
    return LocalStorageCache.get(cacheKey)
  }

  // Set profile data in localStorage cache
  const setCachedProfile = (data: any) => {
    if (typeof window === 'undefined' || !walletAddress) return
    
    const cacheKey = `${PROFILE_CACHE_KEY}-${walletAddress}`
    LocalStorageCache.set(cacheKey, data)
  }

  // SWR hook with enhanced caching
  const swr = useSWR(
    shouldFetch ? [`${API_URL}/settings/profile/profile?wallet=${walletAddress}`, walletAddress] : null,
    async ([url]) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      
      // Cache the successful response
      setCachedProfile(data)
      return data
    },
    {
      ...profileSWRConfig,
      // Use cached data as fallback
      fallback: getCachedProfile() ? { [getProfileCacheKey(walletAddress!)]: getCachedProfile() } : undefined,
      // Revalidate on mount only if no cached data
      revalidateOnMount: !getCachedProfile(),
      // Don't revalidate if we have recent cached data
      revalidateIfStale: !getCachedProfile(),
    }
  )

  const data = swr?.data ?? getCachedProfile() ?? {}
  const error = swr?.error ?? null
  const isLoading = swr?.isLoading ?? false

  return {
    profileComplete: data.allComplete ?? null,
    checking: isLoading && !getCachedProfile(), // Don't show loading if we have cached data
    walletConnected: walletConnected ?? false,
    walletAddress: walletAddress ?? "",
    error: error,
    // Add cache status for debugging
    isCached: !!getCachedProfile(),
    // Force refresh function
    refresh: () => {
      const cacheKey = `${PROFILE_CACHE_KEY}-${walletAddress}`
      LocalStorageCache.delete(cacheKey)
      swr.mutate()
    }
  }
}
