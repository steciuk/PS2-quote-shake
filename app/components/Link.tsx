import { openLinkInBrowser } from "app/utils/openLinkInBrowser"
import React from "react"

import { Text } from "./Text"

export const Link = (props: { label: string; link: string }) => {
  return (
    <Text
      text={props.label}
      onPress={() => openLinkInBrowser(props.link)}
      style={{ textDecorationLine: "underline" }}
    />
  )
}
