"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, X, Check, CreditCard } from "lucide-react"
import { RippleButton } from "./ui/ripple-button"

interface PaperPurchaseProps {
  paper: any
  onClose: () => void
  onComplete: () => void
}

export function PaperPurchase({ paper, onClose, onComplete }: PaperPurchaseProps) {
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  const handlePurchase = () => {
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setCompleted(true)

      // Simulate API delay
      setTimeout(() => {
        onComplete()
      }, 1500)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-yellow-500" />
            <h3 className="font-bold text-lg">Purchase Premium Paper</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" disabled={processing}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!completed ? (
            <>
              <div className="mb-6">
                <h4 className="font-medium mb-2">Paper Details</h4>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <h5 className="font-medium mb-1">{paper.title}</h5>
                  <p className="text-sm text-gray-400 mb-2">By {paper.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">One-time purchase</span>
                    <span className="font-bold text-lg">${paper.price}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  <p>This purchase grants you permanent access to the full paper, including:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Complete paper content</li>
                    <li>Downloadable PDF version</li>
                    <li>Future updates and revisions</li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2">Payment Method</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-800 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <span>Credit / Debit Card</span>
                    </div>
                    <input
                      type="radio"
                      name="payment-method"
                      value="credit-card"
                      checked={paymentMethod === "credit-card"}
                      onChange={() => setPaymentMethod("credit-card")}
                      className="h-4 w-4 accent-mintellect-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-800 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="#9ca3af"
                          strokeWidth="2"
                        />
                        <path
                          d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5"
                          stroke="#9ca3af"
                          strokeWidth="2"
                        />
                        <path d="M12 7V5M12 19V17" stroke="#9ca3af" strokeWidth="2" />
                      </svg>
                      <span>Pay with Mintellect Credits</span>
                    </div>
                    <input
                      type="radio"
                      name="payment-method"
                      value="credits"
                      checked={paymentMethod === "credits"}
                      onChange={() => setPaymentMethod("credits")}
                      className="h-4 w-4 accent-mintellect-primary"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <RippleButton variant="outline" className="flex-1" onClick={onClose} disabled={processing}>
                  Cancel
                </RippleButton>
                <RippleButton
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                  onClick={handlePurchase}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="mr-2">Processing</span>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    </>
                  ) : (
                    `Purchase for $${paper.price}`
                  )}
                </RippleButton>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Purchase Successful!</h4>
              <p className="text-gray-400 mb-6">You now have full access to this paper.</p>
              <RippleButton onClick={onComplete} className="mx-auto">
                View Full Paper
              </RippleButton>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
