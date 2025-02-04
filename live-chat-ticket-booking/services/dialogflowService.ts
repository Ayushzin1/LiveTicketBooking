import type { BookingContextType } from "../contexts/BookingContext"
import type { Dispatch, SetStateAction } from "react"

interface Message {
  text: string
  sender: "user" | "bot"
}

// This is a mock implementation. In a real application, you would make API calls to Dialogflow.
export const handleDialogflowResponse = async (
  input: string,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  booking: BookingContextType,
): Promise<string> => {
  let response = ""

  if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
    response =
      "Hello! Welcome to our ticket booking system. What would you like to book? We have options for Movies, Events, and Travel."
  } else if (input.toLowerCase().includes("movie")) {
    booking.setCategory("Movies")
    response =
      "Great! What movie would you like to watch? We have 'Avengers: Endgame', 'Inception', and 'The Shawshank Redemption' playing."
  } else if (input.toLowerCase().includes("event")) {
    booking.setCategory("Events")
    response =
      "Excellent! We have several events available. Would you like to attend a 'Concert', 'Sports Match', or 'Comedy Show'?"
  } else if (input.toLowerCase().includes("travel")) {
    booking.setCategory("Travel")
    response =
      "Perfect! Where would you like to travel? We have tickets available for 'Paris', 'Tokyo', and 'New York'."
  } else if (
    input.toLowerCase().includes("avengers") ||
    input.toLowerCase().includes("inception") ||
    input.toLowerCase().includes("shawshank")
  ) {
    booking.setSelectedOption(input)
    response = `Great choice! When would you like to watch ${input}? Please provide a date (YYYY-MM-DD).`
  } else if (
    input.toLowerCase().includes("concert") ||
    input.toLowerCase().includes("sports") ||
    input.toLowerCase().includes("comedy")
  ) {
    booking.setSelectedOption(input)
    response = `Excellent! When would you like to attend the ${input}? Please provide a date (YYYY-MM-DD).`
  } else if (
    input.toLowerCase().includes("paris") ||
    input.toLowerCase().includes("tokyo") ||
    input.toLowerCase().includes("new york")
  ) {
    booking.setSelectedOption(input)
    response = `Wonderful! When would you like to travel to ${input}? Please provide a date (YYYY-MM-DD).`
  } else if (input.match(/^\d{4}-\d{2}-\d{2}$/)) {
    booking.setDate(input)
    response = "Great! What time would you prefer? We have slots at 10:00 AM, 2:00 PM, and 7:00 PM."
  } else if (input.toLowerCase().includes("am") || input.toLowerCase().includes("pm")) {
    booking.setTime(input)
    response = "Excellent! How many tickets would you like to book?"
  } else if (!isNaN(Number(input))) {
    booking.setTickets(Number(input))
    response = `Perfect! You're all set to book ${booking.tickets} ticket(s) for ${booking.selectedOption} on ${booking.date} at ${booking.time}. Please click the 'Confirm Booking' button to finalize your reservation.`
  } else {
    response = "I'm sorry, I didn't understand that. Could you please rephrase or provide more information?"
  }

  setMessages((prev) => [...prev, { text: response, sender: "bot" }])
  return response
}

// Add this new function for handling voice input
export const handleVoiceInput = async (
  audioBlob: Blob,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  booking: BookingContextType,
): Promise<string> => {
  // In a real implementation, you would send the audio to Dialogflow for processing
  // For this mock version, we'll convert the audio to text client-side and use the existing logic
  const transcript = await convertSpeechToText(audioBlob)
  return handleDialogflowResponse(transcript, setMessages, booking)
}

// Mock function to convert speech to text (in a real app, this would be done by Dialogflow)
const convertSpeechToText = async (audioBlob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // This is a mock result. In a real app, this would be the result from Dialogflow's speech-to-text
      resolve("This is a mock transcript of the audio input")
    }, 1000)
  })
}

