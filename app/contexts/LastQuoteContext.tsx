import { Quote } from "app/services/api"
import React, { createContext, ReactNode } from "react"

export const LastQuoteContext = createContext<Quote | null>(null)
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const LastQuoteSetterContext = createContext<(quote: Quote) => void>(() => {})

export const LastQuoteProvider = ({ children }: { children: ReactNode }) => {
  const [lastQuote, setLastQuote] = React.useState<Quote | null>(null)

  const setQuote = (quote: Quote) => {
    setLastQuote(quote)
  }

  return (
    <LastQuoteContext.Provider value={lastQuote}>
      <LastQuoteSetterContext.Provider value={setQuote}>{children}</LastQuoteSetterContext.Provider>
    </LastQuoteContext.Provider>
  )
}
