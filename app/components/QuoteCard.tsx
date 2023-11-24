import { Button } from "app/components/Button"
import { Card } from "app/components/Card"
import { Icon } from "app/components/Icon"
import { Text } from "app/components/Text"
import { FavoriteQuotesManagerContext } from "app/contexts/FavoriteQuotesContext"
import { Quote } from "app/services/api"
import { colors, spacing } from "app/theme"
import { openLinkInBrowser } from "app/utils/openLinkInBrowser"
import React, { useContext } from "react"
import { StyleProp, View, ViewStyle } from "react-native"

export const QuoteCard = (props: {
  quote: Quote
  isFavorite: boolean
  showButtons?: boolean
  onPress?: (quoteText: string) => void
  style?: StyleProp<ViewStyle>
}) => {
  const { onPress, showButtons, style } = props

  const { add, remove } = useContext(FavoriteQuotesManagerContext)
  const { quote } = props

  return (
    <Card
      style={[{ minHeight: 0 }, style]}
      onPress={onPress ? () => onPress(quote.quoteText) : undefined}
      HeadingComponent={
        <Text
          text={quote.quoteAuthor || "Unknown"}
          size="xs"
          style={{ color: colors.textDim, marginBottom: spacing.xxs }}
        />
      }
      ContentComponent={
        <Text text={quote.quoteText} size="md" weight="medium" style={{ fontStyle: "italic" }} />
      }
      FooterComponent={
        showButtons ? (
          <View
            style={{
              flexDirection: "row",
              marginTop: spacing.sm,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <>
              {props.isFavorite ? (
                <Button
                  LeftAccessory={(...props) => (
                    <Icon icon="heart" color={colors.palette.primary400} size={20} {...props} />
                  )}
                  onPress={() => remove(quote.quoteText)}
                  style={$favoriteButton}
                />
              ) : (
                <Button
                  LeftAccessory={(...props) => (
                    <Icon icon="heart" color={colors.text} size={20} {...props} />
                  )}
                  onPress={() => add(quote)}
                  style={$favoriteButton}
                />
              )}
              <Button
                LeftAccessory={(...props) => (
                  <Icon icon="info" color={colors.text} size={20} {...props} />
                )}
                onPress={() => openLinkInBrowser(getAuthorLink(quote.quoteAuthor))}
                style={$infoButton}
                disabled={!quote.quoteAuthor}
              />
            </>
          </View>
        ) : undefined
      }
    />
  )
}

function getAuthorLink(author: string) {
  return `https://en.wikipedia.org/wiki/Special:Search?search=${author.replace(" ", "_")}`
}

const $button: ViewStyle = {
  borderRadius: 17,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.sm,
  minHeight: 32,
}

const $favoriteButton: ViewStyle = {
  ...$button,
}

const $infoButton: ViewStyle = {
  ...$button,
}
