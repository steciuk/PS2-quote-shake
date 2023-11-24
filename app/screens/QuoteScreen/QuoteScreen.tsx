import { Button, Card, Screen, Text } from "app/components"
import { QuoteCard } from "app/components/QuoteCard"
import { FavoriteQuotesContext } from "app/contexts/FavoriteQuotesContext"
import { SettingsContext } from "app/contexts/SettingsContext"
import { api, Quote } from "app/services/api"
import { colors } from "app/theme"
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
    <Screen preset="fixed" safeAreaEdges={["bottom", "top"]} style={{ padding: 15 }}>
      <View
        style={{
          flex: 1,
          flexBasis: "90%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <Text text="Loading..." />
        ) : error ? (
          <Card
            HeadingComponent={
              <Text text="Error" size="lg" weight="medium" style={{ color: colors.error }} />
            }
            ContentComponent={<Text text={error} style={{ color: colors.error }} />}
            style={{ backgroundColor: colors.errorBackground }}
          />
        ) : lastQuote ? (
          <QuoteCard quote={lastQuote} isFavorite={isFavorite} />
        ) : (
          <Text text="No quote" />
        )}
      </View>
      <Button
        preset="default"
        text={lastQuote && !error ? "Get another quote" : "Get a quote"}
        onPress={getQuote}
        disabled={isLoading}
      />
    </Screen>
  )
}

function isQuoteInFavorites(quote: Quote, favorites: Quote[]) {
  return favorites.some((q) => q.quoteText === quote.quoteText)
}
