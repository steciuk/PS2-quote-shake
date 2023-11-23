import { AppStackParamList } from "app/navigators/AppNavigator"
import { AboutScreen, FavoritesScreen, QuoteScreen, SettingsScreen } from "app/screens"
import { colors } from "app/theme"
import React from "react"
import { ViewStyle } from "react-native"
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
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        // tabBarActiveTintColor: colors.text,
        // tabBarInactiveTintColor: colors.text,
        // tabBarLabelStyle: $tabBarLabel,
        // tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Quote"
        component={QuoteScreen}
        options={{
          tabBarLabel: "Get quote",
          // tabBarIcon: ({ color }) => <Icon name="quote" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: "Favorites",
          // tabBarIcon: ({ color }) => <Icon name="heart" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          // tabBarIcon: ({ color }) => <Icon name="gear" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: "About",
          // tabBarIcon: ({ color }) => <Icon name="info" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

// const $tabBarItem: ViewStyle = {
//   paddingTop: spacing.md,
// }

// const $tabBarLabel: TextStyle = {
//   fontSize: 12,
//   fontFamily: typography.primary.medium,
//   lineHeight: 16,
//   flex: 1,
// }
