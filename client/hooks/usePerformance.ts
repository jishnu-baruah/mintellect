import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  initialLoadTime: number
  cachedLoadTime: number
  apiCallTime: number
  cacheHitRate: number
  totalRequests: number
  cachedRequests: number
}

export function usePerformance() {
  const metricsRef = useRef<PerformanceMetrics>({
    initialLoadTime: 0,
    cachedLoadTime: 0,
    apiCallTime: 0,
    cacheHitRate: 0,
    totalRequests: 0,
    cachedRequests: 0
  })

  const startTimeRef = useRef<number>(0)

  const startTimer = () => {
    startTimeRef.current = performance.now()
  }

  const endTimer = (type: 'initial' | 'cached' | 'api') => {
    const endTime = performance.now()
    const duration = endTime - startTimeRef.current

    switch (type) {
      case 'initial':
        metricsRef.current.initialLoadTime = duration
        break
      case 'cached':
        metricsRef.current.cachedLoadTime = duration
        metricsRef.current.cachedRequests++
        break
      case 'api':
        metricsRef.current.apiCallTime = duration
        metricsRef.current.totalRequests++
        break
    }

    // Update cache hit rate
    if (metricsRef.current.totalRequests > 0) {
      metricsRef.current.cacheHitRate = 
        (metricsRef.current.cachedRequests / metricsRef.current.totalRequests) * 100
    }
  }

  const logMetrics = () => {
    console.log('🚀 Performance Metrics:', {
      'Initial Load Time': `${metricsRef.current.initialLoadTime.toFixed(2)}ms`,
      'Cached Load Time': `${metricsRef.current.cachedLoadTime.toFixed(2)}ms`,
      'API Call Time': `${metricsRef.current.apiCallTime.toFixed(2)}ms`,
      'Cache Hit Rate': `${metricsRef.current.cacheHitRate.toFixed(1)}%`,
      'Total Requests': metricsRef.current.totalRequests,
      'Cached Requests': metricsRef.current.cachedRequests
    })
  }

  // Log metrics on component unmount
  useEffect(() => {
    return () => {
      if (metricsRef.current.totalRequests > 0) {
        logMetrics()
      }
    }
  }, [])

  return {
    startTimer,
    endTimer,
    metrics: metricsRef.current,
    logMetrics
  }
}





