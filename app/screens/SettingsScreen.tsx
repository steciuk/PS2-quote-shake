import { Button, Screen, Text, Toggle } from "app/components"
import {
  availableQuotesLanguages,
  QuotesLanguage,
  SettingsContext,
  SettingsSetterContext,
} from "app/contexts/SettingsContext"
import { colors, spacing } from "app/theme"
import React, { useContext, useEffect, useState } from "react"
import { View } from "react-native"

import Slider from "@react-native-community/slider"

const quotesLanguagesLabels: { [key in QuotesLanguage]: string } = {
  en: "English",
  ru: "Russian",
}

export const SettingsScreen = () => {
  const { quotesLanguage, shakeEnabled, shakeSensitivity } = useContext(SettingsContext)
  const { updateSettings, restoreDefaultSettings } = useContext(SettingsSetterContext)

  const [currentShakeSensitivity, setCurrentShakeSensitivity] = useState<number>(shakeSensitivity)

  useEffect(() => {
    setCurrentShakeSensitivity(shakeSensitivity)
  }, [shakeSensitivity])

  return (
    <Screen
      preset="auto"
      safeAreaEdges={["top"]}
      contentContainerStyle={{ flex: 1, padding: spacing.md }}
    >
      <Text preset="heading" text="Settings" />
      <View style={{ gap: spacing.lg }}>
        <View>
          <Text preset="subheading" text="Quotes language" />
          <Text preset="formHelper" text="Selected language will be applied only for new quotes" />
          <View style={{ gap: spacing.xs, marginTop: spacing.xs }}>
            {availableQuotesLanguages.map((language) => (
              <Toggle
                key={language}
                variant="radio"
                label={quotesLanguagesLabels[language]}
                value={quotesLanguage === language}
                onValueChange={(value) => {
                  value && updateSettings({ quotesLanguage: language })
                }}
              />
            ))}
          </View>
        </View>
        <View>
          <Text preset="subheading" text="Shake settings" />
          <View style={{ gap: spacing.xs, marginTop: spacing.xs }}>
            <Toggle
              variant="switch"
              label="Shake to get a new quote"
              value={shakeEnabled}
              onValueChange={(value) => updateSettings({ shakeEnabled: value })}
            />
            <Text
              preset="formHelper"
              text="Shake sensitivity threshold (higher=less sensitive)"
              style={{
                opacity: shakeEnabled ? 1 : 0.5,
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <Slider
                value={shakeSensitivity}
                disabled={!shakeEnabled}
                minimumValue={1}
                maximumValue={5}
                step={0.1}
                onSlidingComplete={(value) => updateSettings({ shakeSensitivity: value })}
                onValueChange={(value) => setCurrentShakeSensitivity(value)}
                minimumTrackTintColor={colors.palette.secondary500}
                thumbTintColor={colors.palette.secondary500}
                style={{ flex: 1 }}
              />
              <Text text={currentShakeSensitivity.toFixed(1)} />
            </View>
          </View>
        </View>
        <View>
          <Text preset="subheading" text="Restore default settings" />
          <Button
            onPress={restoreDefaultSettings}
            style={{
              backgroundColor: colors.errorBackground,
              marginTop: spacing.xs,
              alignSelf: "flex-start",
              minHeight: 0,
            }}
          >
            <Text text="Restore" weight="medium" style={{ color: colors.error }} />
          </Button>
        </View>
      </View>
    </Screen>
  )
}
