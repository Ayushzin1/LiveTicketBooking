"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface BookingContextType {
  category: string | null
  setCategory: (category: string) => void
  selectedOption: string | null
  setSelectedOption: (option: string) => void
  date: string | null
  setDate: (date: string) => void
  time: string | null
  setTime: (time: string) => void
  tickets: number
  setTickets: (tickets: number) => void
  price: number
  setPrice: (price: number) => void
  resetBooking: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [category, setCategory] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [tickets, setTickets] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)

  const resetBooking = () => {
    setCategory(null)
    setSelectedOption(null)
    setDate(null)
    setTime(null)
    setTickets(0)
    setPrice(0)
  }

  return (
    <BookingContext.Provider
      value={{
        category,
        setCategory,
        selectedOption,
        setSelectedOption,
        date,
        setDate,
        time,
        setTime,
        tickets,
        setTickets,
        price,
        setPrice,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

