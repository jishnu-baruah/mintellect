'use client'

import PaymentComponent from '@/components/PaymentComponent'

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Purchase Edu Tokens</h1>
          <p className="mt-2 text-lg text-gray-600">
            Buy EDU tokens to access our plagiarism reduction services
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Each EDU token gives you access to one plagiarism check
          </p>
        </div>
        
        <PaymentComponent />
      </div>
    </div>
  )
} 