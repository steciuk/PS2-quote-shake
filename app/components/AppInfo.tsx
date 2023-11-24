import { Text } from "app/components"
import { spacing } from "app/theme"
import { openLinkInBrowser } from "app/utils/openLinkInBrowser"
import React from "react"
import { Image, View } from "react-native"

const imgSize = 250

export const AppInfo = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("assets/images/quoteshake.png")}
        style={{ width: imgSize, height: imgSize, resizeMode: "contain" }}
      />
      <View style={{ marginTop: spacing.xl, alignItems: "center" }}>
        <Text text="Made with ♥ by Adam Steciuk" />
        <Text
          text="https://github.com/steciuk"
          onPress={() => openLinkInBrowser("https://github.com/steciuk")}
          style={{ textDecorationLine: "underline" }}
        />
        <Text
          text="a.t.steciuk@gmail.com"
          onPress={() => openLinkInBrowser("mailto:a.t.steciuk@gmail.com")}
          style={{ textDecorationLine: "underline" }}
        />
      </View>
    </View>
  )
}
