"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard, Calendar, Lock } from "lucide-react"

interface PaymentGatewayProps {
  amount: number
  onPaymentComplete: (success: boolean) => void
  darkMode: boolean
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, onPaymentComplete, darkMode }) => {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing
    try {
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber,
          expiryDate,
          cvv,
          amount,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onPaymentComplete(true)
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      onPaymentComplete(false)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <h2 className="text-2xl font-bold mb-4">Payment Gateway</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className={`w-full p-2 pl-10 rounded border ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              }`}
              required
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="expiryDate" className="block mb-1">
              Expiry Date
            </label>
            <div className="relative">
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                className={`w-full p-2 pl-10 rounded border ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
                required
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="cvv" className="block mb-1">
              CVV
            </label>
            <div className="relative">
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className={`w-full p-2 pl-10 rounded border ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>
        <div>
          <p className="mb-2">Total Amount: ${amount.toFixed(2)}</p>
          <button
            type="submit"
            disabled={processing}
            className={`w-full p-2 rounded ${
              darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition-colors ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentGateway

