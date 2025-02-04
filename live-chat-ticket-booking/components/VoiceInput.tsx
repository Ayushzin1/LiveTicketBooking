"use client"

import { useState, useEffect, useCallback } from "react"
import { Mic, MicOff } from "lucide-react"
import type React from "react" // Added import for React

interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  isListening: boolean
  setIsListening: (isListening: boolean) => void
  darkMode: boolean
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isListening, setIsListening, darkMode }) => {
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"
      setRecognition(recognitionInstance)
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start()
      setIsListening(true)
    }
  }, [recognition, setIsListening])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition, setIsListening])

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("")

        onTranscript(transcript)
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    }
  }, [recognition, onTranscript, setIsListening])

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`p-2 rounded-full ${
        isListening
          ? darkMode
            ? "bg-red-700 text-white"
            : "bg-red-500 text-white"
          : darkMode
            ? "bg-blue-700 text-white"
            : "bg-blue-500 text-white"
      }`}
    >
      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
    </button>
  )
}

export default VoiceInput

