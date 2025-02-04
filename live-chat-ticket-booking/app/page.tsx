"use client"

import { useState } from "react"
import Chat from "../components/Chat"
import { BookingProvider } from "../contexts/BookingContext"
import { Volume2, VolumeX } from "lucide-react"

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  return (
    <BookingProvider>
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <div className={`container mx-auto p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Live Chat Ticket Booking System</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-4 py-2 ${darkMode ? "bg-blue-700" : "bg-blue-500"} text-white rounded hover:opacity-80 transition-colors`}
              >
                Toggle {darkMode ? "Light" : "Dark"} Mode
              </button>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-4 py-2 ${
                  voiceEnabled ? "bg-green-500" : "bg-red-500"
                } text-white rounded hover:opacity-80 transition-colors`}
              >
                {voiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
            </div>
          </div>
          <Chat voiceEnabled={voiceEnabled} darkMode={darkMode} />
        </div>
      </div>
    </BookingProvider>
  )
}

