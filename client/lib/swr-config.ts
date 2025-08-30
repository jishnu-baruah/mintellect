import { SWRConfiguration } from 'swr'

// SWR configuration with persistent cache and optimized settings
export const swrConfig: SWRConfiguration = {
  // Cache data for longer periods
  dedupingInterval: 60000, // 1 minute - prevent duplicate requests
  focusThrottleInterval: 5000, // 5 seconds - throttle focus revalidation
  
  // Persistent cache settings
  keepPreviousData: true, // Keep previous data while fetching new data
  
  // Error handling
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  
  // Revalidation settings
  revalidateOnFocus: false, // Don't revalidate on window focus
  revalidateOnReconnect: true, // Revalidate when reconnecting to network
  
  // Cache time
  revalidateIfStale: false, // Don't revalidate if data is stale
  
  // Optimistic updates
  optimisticData: true,
  
  // Fetcher with error handling
  fetcher: async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      error.message = await res.text()
      throw error
    }
    return res.json()
  }
}

// Profile-specific SWR config
export const profileSWRConfig: SWRConfiguration = {
  ...swrConfig,
  // Cache profile data for longer (5 minutes)
  dedupingInterval: 300000,
  // Don't revalidate on focus for profile data
  revalidateOnFocus: false,
  // Keep profile data in cache longer
  revalidateIfStale: false,
}





