import { Screen } from "app/components"
import { AppInfo } from "app/components/AppInfo"
import { spacing } from "app/theme"
import React from "react"

export const AboutScreen = () => {
  return (
    <Screen
      preset="auto"
      safeAreaEdges={["top"]}
      contentContainerStyle={{ flex: 1, padding: spacing.md }}
    >
      <AppInfo />
    </Screen>
  )
}
