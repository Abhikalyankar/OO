import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import { MotiView, AnimatePresence } from "moti";
import Icon from "react-native-vector-icons/Feather";

export default function FoodMenu({
  restaurant,
  cart,
  onBack,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
  getItemQuantity,
  getCartTotal,
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All" },
    { id: "veg", name: "Veg" },
    { id: "nonveg", name: "Non-Veg" },
    { id: "drinks", name: "Drinks" },
  ];

  const menuItems = [
    {
      id: "1",
      name: "Paneer Biryani",
      description: "Aromatic basmati rice with paneer and spices",
      category: "veg",
      price: 180,
      rating: 4.5,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1600628422011-046378d9a4b8?w=400",
    },
    {
      id: "2",
      name: "Chicken Biryani",
      description: "Hyderabadi style spicy chicken biryani",
      category: "nonveg",
      price: 220,
      rating: 4.7,
      veg: false,
      image:
        "https://images.unsplash.com/photo-1600628422814-06a2a8a42db8?w=400",
    },
    {
      id: "3",
      name: "Masala Chai",
      description: "Strong Indian tea with spices and milk",
      category: "drinks",
      price: 40,
      rating: 4.3,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1589308078055-139d1c58e2c5?w=400",
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) =>
      (selectedCategory === "all" || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <Icon name="star" size={12} color="#fff" />
          <Text style={styles.ratingText}>{restaurant.rating}</Text>
        </View>
      </MotiView>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={16}
          color="#666"
          style={{ marginHorizontal: 8 }}
        />
        <TextInput
          placeholder="Search menu items..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>

      {/* CATEGORY FILTER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryBadge,
              selectedCategory === cat.id && styles.categoryActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MENU ITEMS */}
      <ScrollView
        style={styles.menuScroll}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <AnimatePresence>
          {filteredMenuItems.map((item, index) => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 0.05 }}
              style={styles.card}
            >
              <View style={styles.menuItemRow}>
                {/* Info */}
                <View style={{ flex: 1, marginRight: 10 }}>
                  <View
                    style={[
                      styles.vegDot,
                      { borderColor: item.veg ? "green" : "red" },
                    ]}
                  >
                    <View
                      style={[
                        styles.vegInner,
                        { backgroundColor: item.veg ? "green" : "red" },
                      ]}
                    />
                  </View>

                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    <View style={styles.ratingSmall}>
                      <Icon
                        name="star"
                        size={12}
                        color="#facc15"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={{ fontSize: 12 }}>{item.rating}</Text>
                    </View>
                  </View>
                </View>

                {/* Image and Add Button */}
                <View style={styles.imageColumn}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />

                  {getItemQuantity(item.id) > 0 ? (
                    <View style={styles.counterContainer}>
                      <TouchableOpacity
                        onPress={() => onRemoveFromCart(item.id)}
                      >
                        <Icon name="minus" size={18} color="#007AFF" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {getItemQuantity(item.id)}
                      </Text>
                      <TouchableOpacity onPress={() => onAddToCart(item)}>
                        <Icon name="plus" size={18} color="#007AFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => onAddToCart(item)}
                      style={styles.addButton}
                    >
                      <Icon name="plus" size={14} color="#fff" />
                      <Text style={styles.addText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </MotiView>
          ))}
        </AnimatePresence>
      </ScrollView>

      {/* CART FOOTER */}
      {cart.length > 0 && (
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.footer}
        >
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={onCheckout}
            activeOpacity={0.9}
          >
            <View>
              <Text style={{ color: "#fff", fontSize: 13 }}>
                {cart.reduce((total, item) => total + item.quantity, 0)} items
              </Text>
              <Text style={styles.totalText}>₹{getCartTotal()}</Text>
            </View>
            <View style={styles.checkoutRight}>
              <Text style={styles.checkoutText}>Checkout</Text>
              <Icon name="chevron-right" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: { marginRight: 10 },
  restaurantName: { color: "#fff", fontSize: 18, fontWeight: "600" },
  restaurantCuisine: { color: "#e0e0e0", fontSize: 13 },
  ratingContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
  },
  ratingText: { color: "#fff", marginLeft: 4, fontSize: 12 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    margin: 10,
    borderRadius: 10,
  },
  searchInput: { flex: 1, paddingVertical: 8 },
  categoryScroll: { paddingHorizontal: 10, paddingVertical: 6 },
  categoryBadge: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryActive: { backgroundColor: "#007AFF" },
  categoryText: { color: "#007AFF" },
  categoryTextActive: { color: "#fff" },
  menuScroll: { flex: 1, padding: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    padding: 10,
  },
  menuItemRow: { flexDirection: "row" },
  vegDot: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  vegInner: { width: 8, height: 8, borderRadius: 4 },
  itemName: { fontWeight: "600", fontSize: 15, marginVertical: 4 },
  itemDesc: { color: "#777", fontSize: 12, marginBottom: 6 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPrice: { fontWeight: "bold", color: "#000" },
  ratingSmall: { flexDirection: "row", alignItems: "center" },
  imageColumn: { alignItems: "center" },
  itemImage: { width: 80, height: 80, borderRadius: 8 },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#e8f0ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  quantityText: { fontWeight: "600", color: "#007AFF" },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  addText: { color: "#fff", marginLeft: 4, fontWeight: "600" },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#007AFF",
    padding: 14,
  },
  checkoutBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  checkoutRight: { flexDirection: "row", alignItems: "center" },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600", marginRight: 6 },
});