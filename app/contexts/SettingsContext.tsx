import React, { createContext, ReactNode, useState } from "react"

type Settings = {
  language: "en" | "ru"
}

const defaultSettings: Settings = {
  language: "en",
}

export const SettingsContext = createContext<Settings>(defaultSettings)
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const SettingsSetterContext = createContext<(settings: Partial<Settings>) => void>(() => {})

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const newSettings = (settings: Partial<Settings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...settings }))
  }

  return (
    <SettingsContext.Provider value={settings}>
      <SettingsSetterContext.Provider value={newSettings}>
        {children}
      </SettingsSetterContext.Provider>
    </SettingsContext.Provider>
  )
}
