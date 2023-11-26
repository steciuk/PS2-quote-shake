import { mailto, openLinkInBrowser } from "app/utils/openLinkInBrowser"
import React from "react"

import { Text } from "./Text"

export const Link = (props: { label: string; link: string; mailto?: boolean }) => {
  return (
    <Text
      text={props.label}
      onPress={() => (props.mailto ? mailto(props.link) : openLinkInBrowser(props.link))}
      style={{ textDecorationLine: "underline" }}
    />
  )
}
