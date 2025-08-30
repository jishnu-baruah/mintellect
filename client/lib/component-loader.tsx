import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-mintellect-primary mx-auto mb-2" />
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
)

// Lazy load heavy pages with consistent loading UI
export const lazyLoadPage = (importFunc: () => Promise<any>, options = {}) => {
  return dynamic(importFunc, {
    loading: PageLoader,
    ssr: false, // Disable SSR for heavy components to prevent hydration issues
    ...options
  })
}

// Predefined lazy-loaded pages
export const LazyAnalytics = lazyLoadPage(() => import('@/app/analytics/page'))
export const LazyWorkflow = lazyLoadPage(() => import('@/app/workflow/page'))
export const LazyCommunity = lazyLoadPage(() => import('@/app/community/page'))
export const LazyNFTGallery = lazyLoadPage(() => import('@/app/nft-gallery/page'))
export const LazyDocuments = lazyLoadPage(() => import('@/app/documents/page'))

// Lazy load heavy components
export const LazyPlagiarismReduction = lazyLoadPage(() => import('@/components/plagiarism-reduction'))
export const LazyTrustScoreGenerator = lazyLoadPage(() => import('@/components/trust-score-generator'))
export const LazyNFTMinting = lazyLoadPage(() => import('@/components/nft-minting'))
export const LazyPaymentComponent = lazyLoadPage(() => import('@/components/PaymentComponent'))

// Utility to check if component should be lazy loaded
export const shouldLazyLoad = (componentName: string): boolean => {
  const heavyComponents = [
    'analytics',
    'workflow', 
    'community',
    'nft-gallery',
    'documents',
    'plagiarism-reduction',
    'trust-score-generator',
    'nft-minting',
    'payment'
  ]
  
  return heavyComponents.some(name => 
    componentName.toLowerCase().includes(name.toLowerCase())
  )
}





