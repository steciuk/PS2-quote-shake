import { useEffect, useRef, useState } from "react"
import { BackHandler, Platform } from "react-native"

import {
  createNavigationContainerRef,
  NavigationState,
  PartialState,
} from "@react-navigation/native"

import Config from "../config"
import * as storage from "../utils/storage"
import { useIsMounted } from "../utils/useIsMounted"

import type { PersistNavigationConfig } from "../config/config.base"
import type { AppStackParamList, NavigationProps } from "./AppNavigator"

type Storage = typeof storage

export const navigationRef = createNavigationContainerRef<AppStackParamList>()

export function getActiveRouteName(state: NavigationState | PartialState<NavigationState>): string {
  const route = state.routes[state.index ?? 0]

  if (!route.state) return route.name as keyof AppStackParamList

  return getActiveRouteName(route.state as NavigationState<AppStackParamList>)
}

export function useBackButtonHandler(canExit: (routeName: string) => boolean) {
  if (Platform.OS === "ios") return

  const canExitRef = useRef(canExit)

  useEffect(() => {
    canExitRef.current = canExit
  }, [canExit])

  useEffect(() => {
    const onBackPress = () => {
      if (!navigationRef.isReady()) {
        return false
      }

      const routeName = getActiveRouteName(navigationRef.getRootState())

      if (canExitRef.current(routeName)) {
        BackHandler.exitApp()
        return true
      }

      if (navigationRef.canGoBack()) {
        navigationRef.goBack()
        return true
      }

      return false
    }

    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [])
}

function navigationRestoredDefaultState(persistNavigation: PersistNavigationConfig) {
  if (persistNavigation === "always") return false
  if (persistNavigation === "dev" && __DEV__) return false
  if (persistNavigation === "prod" && !__DEV__) return false

  return true
}

export function useNavigationPersistence(storage: Storage, persistenceKey: string) {
  const [initialNavigationState, setInitialNavigationState] =
    useState<NavigationProps["initialState"]>()
  const isMounted = useIsMounted()

  const initNavState = navigationRestoredDefaultState(Config.persistNavigation)
  const [isRestored, setIsRestored] = useState(initNavState)

  const routeNameRef = useRef<keyof AppStackParamList | undefined>()

  const onNavigationStateChange = (state: NavigationState | undefined) => {
    if (state !== undefined) {
      const currentRouteName = getActiveRouteName(state)

      routeNameRef.current = currentRouteName as keyof AppStackParamList

      storage.save(persistenceKey, state)
    }
  }

  const restoreState = async () => {
    try {
      const state = (await storage.load(persistenceKey)) as NavigationProps["initialState"] | null
      if (state) setInitialNavigationState(state)
    } finally {
      if (isMounted()) setIsRestored(true)
    }
  }

  useEffect(() => {
    if (!isRestored) restoreState()
  }, [isRestored])

  return { onNavigationStateChange, restoreState, isRestored, initialNavigationState }
}

export function navigate(name: unknown, params?: unknown) {
  if (navigationRef.isReady()) {
    // @ts-expect-error
    navigationRef.navigate(name as never, params as never)
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack()
  }
}

export function resetRoot(
  state: Parameters<typeof navigationRef.resetRoot>[0] = { index: 0, routes: [] },
) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(state)
  }
}
