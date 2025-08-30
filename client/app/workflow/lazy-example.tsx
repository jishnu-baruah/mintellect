'use client'

import { LazyPlagiarismReduction, LazyTrustScoreGenerator, LazyNFTMinting } from '@/lib/component-loader'

// Example of how to use lazy loading in your workflow
export function WorkflowWithLazyLoading() {
  return (
    <div>
      {/* These components will only load when needed */}
      <LazyPlagiarismReduction 
        documentId="example-doc"
        onComplete={() => console.log('Plagiarism reduction complete')}
      />
      
      <LazyTrustScoreGenerator 
        documentId="example-doc"
        onComplete={() => console.log('Trust score generated')}
      />
      
      <LazyNFTMinting 
        documentId="example-doc"
        documentName="Example Document"
        trustScore={95}
        onComplete={() => console.log('NFT minted')}
      />
    </div>
  )
}

// Usage in your workflow page:
// 1. Import the lazy components
// 2. Replace the regular imports with lazy ones
// 3. Components will load only when rendered





