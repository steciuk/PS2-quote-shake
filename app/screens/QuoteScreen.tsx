import { Button, Text } from "app/components"
import { FavoriteQuotesContext } from "app/contexts/FavoriteQuotesContext"
import { SettingsContext } from "app/contexts/SettingsContext"
import { api, Quote } from "app/services/api"
import React, { useContext, useMemo, useState } from "react"
import { View } from "react-native"

export const QuoteScreen = () => {
  const favorites = useContext(FavoriteQuotesContext)
  const { language } = useContext(SettingsContext)

  const [lastQuote, setLastQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const isFavorite = useMemo(() => {
    if (!lastQuote) return false
    return isQuoteInFavorites(lastQuote, favorites)
  }, [lastQuote, favorites])

  const getQuote = async () => {
    setIsLoading(true)
    const maxRetries = 10
    let retry = maxRetries

    while (retry > 0) {
      const quoteResponse = await api.getQuote(language)

      if (quoteResponse.kind === "ok") {
        const quote = quoteResponse.quote
        if (isQuoteInFavorites(quote, favorites)) {
          retry--
        } else {
          setLastQuote(quote)
          setError(null)
          setIsLoading(false)
          return
        }
      } else {
        setError(`Response error: ${quoteResponse.kind}`)
        setIsLoading(false)
        return
      }
    }

    setError(`Tried to get a quote ${maxRetries} times, but they were all in favorites`)
    setIsLoading(false)
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <Text text="Loading..." />
      ) : error ? (
        <Text text={error} />
      ) : lastQuote ? (
        <Text text={lastQuote.quoteText} />
      ) : (
        <Text text="No quote" />
      )}
      <Button
        text={lastQuote && !error ? "Get another quote" : "Get a quote"}
        onPress={getQuote}
        disabled={isLoading}
      />
    </View>
  )
}

function isQuoteInFavorites(quote: Quote, favorites: Quote[]) {
  return favorites.some((q) => q.quoteText === quote.quoteText)
}
