"use client"

import { useState, useEffect, useRef } from "react"
import { useBooking } from "../contexts/BookingContext"
import { handleDialogflowResponse } from "../services/dialogflowService"
import { completeBooking } from "../services/bookingService"
import VoiceInput from "./VoiceInput"
import VoiceOutput from "./VoiceOutput"
import PaymentGateway from "./PaymentGateway"

interface Message {
  text: string
  sender: "user" | "bot"
}

interface ChatProps {
  voiceEnabled: boolean
  darkMode: boolean
}

export default function Chat({ voiceEnabled, darkMode }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)
  const booking = useBooking()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatEndRef]) // Corrected dependency

  useEffect(() => {
    // Initial greeting
    handleDialogflowResponse("Hello", setMessages, booking)
  }, [])

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript)
    handleSubmit(new Event("submit") as React.FormEvent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { text: input, sender: "user" }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    const botResponse = await handleDialogflowResponse(input, setMessages, booking)
    if (voiceEnabled) {
      setIsSpeaking(true)
    }
  }

  const handleSpeakingEnd = () => {
    setIsSpeaking(false)
  }

  const handleBooking = async () => {
    const { category, selectedOption, date, time, tickets } = booking
    if (category && selectedOption && date && time && tickets) {
      setShowPayment(true)
    } else {
      setMessages((prev) => [
        ...prev,
        { text: "Please complete all booking details before confirming.", sender: "bot" },
      ])
    }
  }

  const handlePaymentComplete = (success: boolean) => {
    setShowPayment(false)
    if (success) {
      completeBooking(booking).then((result) => {
        setMessages((prev) => [...prev, { text: `Booking confirmed! ${result}`, sender: "bot" }])
        booking.resetBooking()
      })
    } else {
      setMessages((prev) => [...prev, { text: "Payment failed. Please try again.", sender: "bot" }])
    }
  }

  return (
    <div className={`flex flex-col h-[600px] ${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg overflow-hidden`}>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user"
                  ? darkMode
                    ? "bg-blue-700 text-white"
                    : "bg-blue-500 text-white"
                  : darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300 text-black"
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className={`flex p-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={`flex-1 border rounded-l-lg p-2 ${darkMode ? "bg-gray-600 text-white" : "bg-white text-black"}`}
        />
        <button
          type="submit"
          className={`${darkMode ? "bg-blue-700" : "bg-blue-500"} text-white px-4 py-2 rounded-r-lg`}
        >
          Send
        </button>
      </form>
      <div className={`flex justify-between p-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
        {voiceEnabled && (
          <VoiceInput
            onTranscript={handleVoiceInput}
            isListening={isListening}
            setIsListening={setIsListening}
            darkMode={darkMode}
          />
        )}
        <button
          onClick={handleBooking}
          className={`${darkMode ? "bg-green-700" : "bg-green-500"} text-white px-4 py-2 rounded-lg`}
        >
          Confirm Booking
        </button>
      </div>
      {isSpeaking && messages.length > 0 && voiceEnabled && (
        <VoiceOutput text={messages[messages.length - 1].text} onEnd={handleSpeakingEnd} />
      )}
      {showPayment && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md">
            <PaymentGateway
              amount={booking.tickets * 10} // Assuming $10 per ticket
              onPaymentComplete={handlePaymentComplete}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
    </div>
  )
}

