/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("./devtools/ReactotronConfig.ts")
}
import "./i18n"
import "./utils/ignoreWarnings"

import { FavoriteQuotesProvider } from "app/contexts/FavoriteQuotesContext"
import { LastQuoteProvider } from "app/contexts/LastQuoteContext"
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

// Web linking configuration
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

/**
 * This is the root component of our app.
 */
function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!isNavigationStateRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <GestureHandlerRootView style={$container}>
          <SettingsProvider>
            <LastQuoteProvider>
              <FavoriteQuotesProvider>
                <AppNavigator
                  linking={linking}
                  initialState={initialNavigationState}
                  onStateChange={onNavigationStateChange}
                />
              </FavoriteQuotesProvider>
            </LastQuoteProvider>
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
