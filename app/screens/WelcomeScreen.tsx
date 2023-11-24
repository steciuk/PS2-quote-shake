import { AppInfo, Button, Screen } from "app/components"
import React, { FC } from "react"

import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = (props) => {
  const { navigation } = props

  const goNext = () => navigation.navigate("App", { screen: "Quote" })

  return (
    <Screen
      preset="auto"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={{ flex: 1, padding: spacing.md }}
    >
      <AppInfo />
      <Button text="Let's go!" onPress={goNext} preset="default" />
    </Screen>
  )
}
