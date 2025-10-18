import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { MotiView } from "moti";
import Icon from "react-native-vector-icons/Feather";

export default function RestaurantList({ onNavigate, onRestaurantSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const restaurants = [
    {
      id: "1",
      name: "The Biryani House",
      cuisine: "Indian, Mughlai",
      rating: 4.6,
      deliveryTime: "25-30 mins",
      distance: "2.1 km",
      priceForTwo: 400,
      image:
        "https://images.unsplash.com/photo-1598514983311-91bfe1f1e69e?w=400",
      offer: "Flat 20% off on all orders!",
    },
    {
      id: "2",
      name: "Pizza Planet",
      cuisine: "Italian, Fast Food",
      rating: 4.3,
      deliveryTime: "30-35 mins",
      distance: "3.8 km",
      priceForTwo: 500,
      image:
        "https://images.unsplash.com/photo-1601924928585-578d0e804b6f?w=400",
      offer: "Buy 1 Get 1 Free Pizza 🍕",
    },
    {
      id: "3",
      name: "Veggie Delight",
      cuisine: "Pure Veg, Healthy",
      rating: 4.8,
      deliveryTime: "20-25 mins",
      distance: "1.5 km",
      priceForTwo: 350,
      image:
        "https://images.unsplash.com/photo-1604908177443-94d32807cc52?w=400",
    },
  ];

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filters = ["All", "Top Rated", "Fast Delivery", "Pure Veg", "Offers"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => onNavigate("home")} style={styles.iconBtn}>
            <Icon name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Order Food</Text>
            <Text style={styles.headerSub}>Delicious food delivered</Text>
          </View>

          <TouchableOpacity
            onPress={() => onNavigate("chat")}
            style={styles.helpButton}
          >
            <Icon name="message-circle" size={16} color="#fff" />
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#ccc" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search for restaurants or cuisines..."
            placeholderTextColor="#ccc"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
        </View>
      </MotiView>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {filters.map((filter, i) => (
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            key={filter}
          >
            <TouchableOpacity
              style={[styles.filterBadge, i === 0 && styles.filterBadgeActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  i === 0 && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </ScrollView>

      {/* Restaurant List */}
      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 120 }}>
        {filteredRestaurants.length === 0 ? (
          <View style={styles.noResult}>
            <Text style={styles.noResultEmoji}>🔍</Text>
            <Text style={styles.noResultTitle}>No restaurants found</Text>
            <Text style={styles.noResultSub}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          filteredRestaurants.map((restaurant, i) => (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              key={restaurant.id}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => onRestaurantSelect(restaurant)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.cardImage}
                />

                <View style={styles.cardContent}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.cardTitle}>{restaurant.name}</Text>
                    <View style={styles.ratingBadge}>
                      <Icon name="star" size={10} color="#fff" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.cuisine}>{restaurant.cuisine}</Text>

                  <View style={styles.row}>
                    <Icon name="clock" size={12} color="#555" />
                    <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
                    <Text style={{ marginHorizontal: 4, color: "#777" }}>•</Text>
                    <Icon name="map-pin" size={12} color="#555" />
                    <Text style={styles.metaText}>{restaurant.distance}</Text>
                  </View>

                  <Text style={styles.price}>₹{restaurant.priceForTwo} for two</Text>

                  {restaurant.offer && (
                    <View style={styles.offerBadge}>
                      <Text style={styles.offerText}>{restaurant.offer}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </MotiView>
          ))
        )}

        {/* Promo Banner */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={styles.promoCard}>
            <View>
              <View style={styles.row}>
                <Icon name="trending-up" size={14} color="#fff" />
                <Text style={styles.promoTitle}>Super Saver Combo</Text>
              </View>
              <Text style={styles.promoText}>Save up to 60% on combo meals</Text>
            </View>
            <Text style={styles.promoEmoji}>🍔</Text>
          </View>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "#007AFF", padding: 16 },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconBtn: { marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerSub: { color: "#e0e0e0", fontSize: 12 },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  helpText: { color: "#fff", marginLeft: 4, fontSize: 13 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: { flex: 1, color: "#fff" },
  filterScroll: { paddingHorizontal: 10, paddingVertical: 8 },
  filterBadge: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterBadgeActive: { backgroundColor: "#007AFF" },
  filterText: { color: "#007AFF", fontSize: 13 },
  filterTextActive: { color: "#fff" },
  list: { padding: 12 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    marginBottom: 14,
    overflow: "hidden",
  },
  cardImage: { width: 100, height: 100 },
  cardContent: { flex: 1, padding: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { fontWeight: "600", fontSize: 15, color: "#000" },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  ratingText: { color: "#fff", fontSize: 11, marginLeft: 2 },
  cuisine: { color: "#777", fontSize: 13, marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center" },
  metaText: { color: "#555", fontSize: 12, marginLeft: 3 },
  price: { color: "#777", fontSize: 12, marginTop: 4 },
  offerBadge: {
    backgroundColor: "#fde68a",
    paddingHorizontal: 6,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  offerText: { color: "#92400e", fontSize: 11, fontWeight: "600" },
  promoCard: {
    backgroundColor: "#f97316",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  promoTitle: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  promoText: { color: "#fff", opacity: 0.9, fontSize: 12 },
  promoEmoji: { fontSize: 28 },
  noResult: { alignItems: "center", marginTop: 60 },
  noResultEmoji: { fontSize: 60 },
  noResultTitle: { fontWeight: "600", fontSize: 16, marginTop: 10 },
  noResultSub: { color: "#777", fontSize: 13, marginTop: 4 },
});
