import { Link, Text } from "app/components"
import { spacing } from "app/theme"
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
        <Link label="https://github.com/steciuk" link="https://github.com/steciuk" />
        <Link label="a.t.steciuk@gmail.com" link="mailto:a.t.steciuk@gmail.com" />
      </View>
    </View>
  )
}
