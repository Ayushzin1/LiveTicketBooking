"use client"

import { useEffect, type React } from "react"

interface VoiceOutputProps {
  text: string
  onEnd: () => void
}

const VoiceOutput: React.FC<VoiceOutputProps> = ({ text, onEnd }) => {
  useEffect(() => {
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = "en-US"
    speech.onend = onEnd

    window.speechSynthesis.speak(speech)

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [text, onEnd])

  return null
}

export default VoiceOutput

