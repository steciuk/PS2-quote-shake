import * as storage from "app/utils/storage"
import React, { createContext, ReactNode, useEffect, useState } from "react"

export const availableQuotesLanguages = ["en", "ru"] as const
export type QuotesLanguage = (typeof availableQuotesLanguages)[number]

type Settings = {
  quotesLanguage: QuotesLanguage
  shakeEnabled: boolean
  shakeSensitivity: number
}

const defaultSettings: Settings = {
  quotesLanguage: "en",
  shakeEnabled: true,
  shakeSensitivity: 1.8,
}

const STORAGE_KEY = "SETTINGS"

export const SettingsContext = createContext<Settings>(defaultSettings)
export const SettingsSetterContext = createContext<{
  updateSettings: (settings: Partial<Settings>) => void
  restoreDefaultSettings: () => void
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ updateSettings: () => {}, restoreDefaultSettings: () => {} })

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const updateSettings = (settingsToUpdate: Partial<Settings>) => {
    const newSettings = { ...settings, ...settingsToUpdate }
    setSettings(newSettings)
    storage.save(STORAGE_KEY, newSettings)
  }

  const restoreDefaultSettings = () => {
    updateSettings(defaultSettings)
  }

  useEffect(() => {
    const load = async () => {
      const loadedSettings = await storage.load<Settings>(STORAGE_KEY)
      if (loadedSettings) {
        setSettings({ ...defaultSettings, ...loadedSettings })
      }
    }
    load()
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      <SettingsSetterContext.Provider value={{ updateSettings, restoreDefaultSettings }}>
        {children}
      </SettingsSetterContext.Provider>
    </SettingsContext.Provider>
  )
}
