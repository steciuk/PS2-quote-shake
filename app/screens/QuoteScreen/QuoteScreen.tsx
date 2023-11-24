import { Button, Card, Screen, Text } from "app/components"
import { QuoteCard } from "app/components/QuoteCard"
import { FavoriteQuotesContext } from "app/contexts/FavoriteQuotesContext"
import { SettingsContext } from "app/contexts/SettingsContext"
import { api, Quote } from "app/services/api"
import { colors, spacing } from "app/theme"
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors"
import { Listener } from "expo-sensors/build/DeviceSensor"
import React, { useContext, useMemo, useRef, useState } from "react"
import { ActivityIndicator, Image, View } from "react-native"

import { useFocusEffect } from "@react-navigation/core"

const maxRetries = 10

export const QuoteScreen = () => {
  const favorites = useContext(FavoriteQuotesContext)
  const { language } = useContext(SettingsContext)

  const [lastQuote, setLastQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])

  const isLoadingRef = useRef(isLoading)

  const isFavorite = useMemo(() => {
    if (!lastQuote) return false
    return isQuoteInFavorites(lastQuote, favorites)
  }, [lastQuote, favorites])

  const updateIsLoading = (value: boolean) => {
    isLoadingRef.current = value
    setIsLoading(value)
  }

  const getQuote = async () => {
    updateIsLoading(true)
    let retry = maxRetries
    const currentErrors: string[] = []

    while (retry > 0) {
      const quoteResponse = await api.getQuote(language)
      // await delay(3000)

      if (quoteResponse.kind === "ok") {
        const quote = quoteResponse.quote
        if (isQuoteInFavorites(quote, favorites)) {
          retry--
          currentErrors.push("Quote already in favorites")
        } else {
          setLastQuote(quote)
          setErrors([])
          updateIsLoading(false)
          return
        }
      } else {
        currentErrors.push(`Request failed: ${quoteResponse.kind}`)
        retry--
      }
    }

    setErrors(currentErrors)
    updateIsLoading(false)
  }

  useFocusEffect(() => {
    configureShake(() => {
      if (!isLoadingRef.current) {
        getQuote()
      }
    })

    return () => {
      Accelerometer.removeAllListeners()
    }
  })

  return (
    <Screen preset="fixed" safeAreaEdges={["bottom", "top"]} style={{ padding: spacing.md }}>
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
          <ActivityIndicator size={45} color={colors.palette.primary400} />
        ) : errors.length > 0 ? (
          <Card
            HeadingComponent={
              <Text
                text={`Tried to get a quote ${maxRetries} times, but received errors:`}
                size="md"
                weight="bold"
                style={{ color: colors.error }}
              />
            }
            ContentComponent={
              <Text
                text={errors.map((error, index) => `${index + 1}. ${error}`).join("\n")}
                style={{ color: colors.error }}
              />
            }
            style={{ backgroundColor: colors.errorBackground }}
          />
        ) : lastQuote ? (
          <QuoteCard quote={lastQuote} isFavorite={isFavorite} showButtons={true} />
        ) : (
          <View
            style={{
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <Text text="Shake the phone or press the button to get a new quote" />
            <Image
              source={require("assets/images/vibrating.png")}
              style={{ height: 50, aspectRatio: 1 }}
            />
          </View>
        )}
      </View>
      <Button
        preset="default"
        text={lastQuote && !errors.length ? "Get another quote" : "Get a quote"}
        onPress={getQuote}
        disabled={isLoading}
      />
    </Screen>
  )
}

function isQuoteInFavorites(quote: Quote, favorites: Quote[]) {
  return favorites.some((q) => q.quoteText === quote.quoteText)
}

const configureShake = (onShake: (acceleration?: number) => void) => {
  Accelerometer.setUpdateInterval(200)
  const onUpdate: Listener<AccelerometerMeasurement> = ({ x, y, z }) => {
    const acceleration = Math.sqrt(x * x + y * y + z * z)

    const sensibility = 1.8
    if (acceleration >= sensibility) {
      onShake(acceleration)
    }
  }

  Accelerometer.addListener(onUpdate)
}
