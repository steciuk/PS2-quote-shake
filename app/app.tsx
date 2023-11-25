/* eslint-disable import/first */
import "./i18n"
import "./utils/ignoreWarnings"

import { FavoriteQuotesProvider } from "app/contexts/FavoriteQuotesContext"
import { SettingsProvider } from "app/contexts/SettingsContext"
import { useFonts } from "expo-font"
import * as Linking from "expo-linking"
import React from "react"
import { ViewStyle } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"

import Config from "./config"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import { customFontsToLoad } from "./theme"
import * as storage from "./utils/storage"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

const prefix = Linking.createURL("/")
const config = {
  screens: {
    Welcome: "",
    App: {
      screens: {
        Quote: "quote",
        Favorites: "favorites",
        Settings: "settings",
        About: "about",
      },
    },
  },
}

function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  if (!isNavigationStateRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <GestureHandlerRootView style={$container}>
          <SettingsProvider>
            <FavoriteQuotesProvider>
              <AppNavigator
                linking={linking}
                initialState={initialNavigationState}
                onStateChange={onNavigationStateChange}
              />
            </FavoriteQuotesProvider>
          </SettingsProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
}
