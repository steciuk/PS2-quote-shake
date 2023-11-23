import { Icon } from "app/components"
import { AppStackParamList } from "app/navigators/AppNavigator"
import { AboutScreen, FavoritesScreen, QuoteScreen, SettingsScreen } from "app/screens"
import { colors, typography } from "app/theme"
import React from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type TabParamList = {
  Quote: undefined
  Favorites: undefined
  Settings: undefined
  About: undefined
}

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>

const Tab = createBottomTabNavigator<TabParamList>()

export function TabNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      initialRouteName="Quote"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { height: bottom + 70, backgroundColor: colors.background },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: { fontFamily: typography.primary.medium, fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Quote"
        component={QuoteScreen}
        options={{
          tabBarLabel: "Get quote",
          tabBarIcon: ({ focused }) => (
            <Icon icon="quote" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: "Favorites",
          tabBarIcon: ({ focused }) => (
            <Icon icon="heart" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => (
            <Icon icon="settings" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: "About",
          tabBarIcon: ({ focused }) => (
            <Icon icon="info" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
