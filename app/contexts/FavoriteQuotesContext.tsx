import { Quote } from "app/services/api"
import * as storage from "app/utils/storage"
import React, { createContext, ReactNode, useEffect, useState } from "react"

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

const STORAGE_KEY = "FAVORITE_QUOTES"

export const FavoriteQuotesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteQuotes, setFavoriteQuotes] = useState<Quote[]>([])

  const add = (quote: Quote) => {
    const newFavorites = [...favoriteQuotes, quote]
    setFavoriteQuotes(newFavorites)
    storage.save(STORAGE_KEY, newFavorites)
  }

  const remove = (quoteText: string) => {
    const newFavorites = favoriteQuotes.filter((quote) => quote.quoteText !== quoteText)
    setFavoriteQuotes(newFavorites)
    storage.save(STORAGE_KEY, newFavorites)
  }

  const clear = () => {
    setFavoriteQuotes([])
    storage.save(STORAGE_KEY, [])
  }

  useEffect(() => {
    const load = async () => {
      const favorites = await storage.load<Quote[]>(STORAGE_KEY)
      if (favorites) {
        setFavoriteQuotes(favorites)
      }
    }
    load()
  }, [])

  return (
    <FavoriteQuotesContext.Provider value={favoriteQuotes}>
      <FavoriteQuotesManagerContext.Provider value={{ add, remove, clear }}>
        {children}
      </FavoriteQuotesManagerContext.Provider>
    </FavoriteQuotesContext.Provider>
  )
}
