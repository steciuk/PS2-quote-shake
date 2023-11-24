import { Button } from "app/components/Button"
import { Card } from "app/components/Card"
import { Icon } from "app/components/Icon"
import { Text } from "app/components/Text"
import { FavoriteQuotesManagerContext } from "app/contexts/FavoriteQuotesContext"
import { Quote } from "app/services/api"
import { colors, spacing } from "app/theme"
import { openLinkInBrowser } from "app/utils/openLinkInBrowser"
import React, { useContext } from "react"
import { View, ViewStyle } from "react-native"

export const QuoteCard = (props: { quote: Quote; isFavorite: boolean }) => {
  const { add, remove } = useContext(FavoriteQuotesManagerContext)
  const { quote } = props

  return (
    <Card
      HeadingComponent={
        <Text
          text={quote.quoteAuthor}
          size="xs"
          style={{ color: colors.textDim, marginBottom: spacing.xxs }}
        />
      }
      ContentComponent={
        <Text text={quote.quoteText} size="md" weight="medium" style={{ fontStyle: "italic" }} />
      }
      FooterComponent={
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
            />
          </>
        </View>
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
