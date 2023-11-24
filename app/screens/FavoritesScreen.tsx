import { Button, EmptyState, ListView, Screen } from "app/components"
import { QuoteCard } from "app/components/QuoteCard"
import { FavoriteQuotesContext } from "app/contexts/FavoriteQuotesContext"
import { TabScreenProps } from "app/navigators"
import { Quote } from "app/services/api"
import { spacing } from "app/theme"
import React, { useContext, useState } from "react"
import { View } from "react-native"

interface FavoritesScreenProps extends TabScreenProps<"Favorites"> {}

export const FavoritesScreen = (props: FavoritesScreenProps) => {
  const { navigation } = props
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null)

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
          <View style={{ padding: 15 }}>
            <Button text="Add more quotes" onPress={() => navigation.navigate("Quote")} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            preset="generic"
            heading="No favorites yet"
            content="You can add a quote to your favorites by tapping the heart icon on the quote card."
            button="Go get a quote"
            buttonOnPress={() => navigation.navigate("Quote")}
            style={{ marginTop: spacing.xxl }}
            imageSource={require("assets/images/empty.png")}
            imageStyle={{ width: 200, height: 200 }}
          />
        }
      />
    </Screen>
  )
}
