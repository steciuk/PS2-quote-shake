import { Quote } from "app/services/api"
import React, { createContext, ReactNode, useState } from "react"

export const FavoriteQuotesContext = createContext<Quote[]>([])
export const FavoriteQuotesManagerContext = createContext<{
  add: (quote: Quote) => void
  remove: (quoteText: string) => void
  clear: () => void
}>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  add: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  remove: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clear: () => {},
})

export const FavoriteQuotesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteQuotes, setFavoriteQuotes] = useState<Quote[]>([])

  const add = (quote: Quote) => {
    setFavoriteQuotes([...favoriteQuotes, quote])
  }

  const remove = (quoteText: string) => {
    setFavoriteQuotes(favoriteQuotes.filter((quote) => quote.quoteText !== quoteText))
  }

  const clear = () => {
    setFavoriteQuotes([])
  }

  return (
    <FavoriteQuotesContext.Provider value={favoriteQuotes}>
      <FavoriteQuotesManagerContext.Provider value={{ add, remove, clear }}>
        {children}
      </FavoriteQuotesManagerContext.Provider>
    </FavoriteQuotesContext.Provider>
  )
}
