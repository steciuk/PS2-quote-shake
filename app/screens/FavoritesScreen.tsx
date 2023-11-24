import { Button, EmptyState, ListView, QuoteCard, Screen, Text } from "app/components"
import {
  FavoriteQuotesContext,
  FavoriteQuotesManagerContext,
} from "app/contexts/FavoriteQuotesContext"
import { TabScreenProps } from "app/navigators"
import { Quote } from "app/services/api"
import { colors, spacing } from "app/theme"
import React, { useContext, useState } from "react"
import { Modal, View } from "react-native"

interface FavoritesScreenProps extends TabScreenProps<"Favorites"> {}

export const FavoritesScreen = (props: FavoritesScreenProps) => {
  const { navigation } = props

  const { clear: clearFavorites } = useContext(FavoriteQuotesManagerContext)

  const [selectedQuote, setSelectedQuote] = useState<string | null>(null)
  const [isPopupOpened, setIsPopupOpened] = useState<boolean>(false)

  const onQuotePress = (quoteText: string) => {
    setSelectedQuote((previous) => (previous === quoteText ? null : quoteText))
  }

  const favorites = useContext(FavoriteQuotesContext)

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={{ flex: 1 }}>
      <ListView<Quote>
        data={favorites}
        extraData={selectedQuote}
        estimatedItemSize={200}
        keyExtractor={(item) => item.quoteText}
        ListHeaderComponent={
          <View
            style={{ padding: spacing.md, flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text preset="heading" text="Favorites" />
            {favorites.length > 0 ? (
              <Button
                text="Delete all"
                onPress={() => setIsPopupOpened(true)}
                style={{ minHeight: 0 }}
              />
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <QuoteCard
            quote={item}
            isFavorite={true}
            showButtons={selectedQuote === item.quoteText}
            onPress={onQuotePress}
            style={{ marginHorizontal: spacing.xs }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
        ListFooterComponent={() => (
          <View style={{ padding: spacing.md }}>
            <Button
              text={favorites.length === 0 ? "Add some quotes" : "Add more quotes"}
              onPress={() => navigation.navigate("Quote")}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            preset="generic"
            heading="No favorites yet"
            content="You can add a quote to your favorites by tapping the heart icon on the quote card."
            button=""
            // buttonOnPress={() => navigation.navigate("Quote")}
            style={{ marginTop: spacing.xxl }}
            imageSource={require("assets/images/empty.png")}
            imageStyle={{ width: 200, height: 200 }}
          />
        }
      />
      <ConfirmationPopup
        text="Are you sure you want to delete all favorites?"
        visible={isPopupOpened}
        onOk={() => {
          clearFavorites()
          setIsPopupOpened(false)
        }}
        onCancel={() => setIsPopupOpened(false)}
      />
    </Screen>
  )
}

const ConfirmationPopup = (props: {
  text: string
  visible: boolean
  onOk: () => void
  onCancel: () => void
}) => {
  return (
    <Modal
      onRequestClose={props.onCancel}
      transparent={true}
      visible={props.visible}
      animationType="fade"
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.palette.overlay50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            padding: spacing.md,
            borderRadius: 5,
            gap: spacing.md,
          }}
        >
          <Text text={props.text} preset="subheading" />
          <View style={{ flexDirection: "row", gap: spacing.lg }}>
            <Button onPress={props.onCancel} style={$popupButton}>
              <Text text="Go back" weight="medium" />
            </Button>
            <Button
              onPress={props.onOk}
              style={[$popupButton, { backgroundColor: colors.errorBackground }]}
            >
              <Text text="Delete" weight="medium" style={{ color: colors.error }} />
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const $popupButton = {
  flexBasis: 0,
  flex: 1,
}
