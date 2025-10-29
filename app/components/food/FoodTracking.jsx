import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MotiView } from "moti";
import Icon from "react-native-vector-icons/Feather";

export default function FoodTracking({
  restaurant,
  finalTotal,
  onBack,
  orderId,
  onOrderComplete,
}) {
  const [deliveryProgress, setDeliveryProgress] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (orderId && onOrderComplete) {
            onOrderComplete(orderId);
          }
          return 100;
        }
        return prev + 5;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, onOrderComplete]);

  const deliverySteps = [
    { label: "Order Confirmed", completed: deliveryProgress >= 25 },
    { label: "Preparing Food", completed: deliveryProgress >= 50 },
    { label: "Out for Delivery", completed: deliveryProgress >= 75 },
    { label: "Delivered", completed: deliveryProgress >= 100 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Track Order</Text>
            <Text style={styles.orderId}>
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Icon name="phone" size={22} color="#fff" />
        </TouchableOpacity>
      </MotiView>

      {/* Map Mock */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.mapContainer}
      >
        <View style={styles.gridOverlay} />
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={styles.pingDot}
        />
        <MotiView
          from={{ top: "25%", left: "25%" }}
          animate={{
            top:
              deliveryProgress >= 75
                ? "75%"
                : deliveryProgress >= 50
                ? "50%"
                : "25%",
            left:
              deliveryProgress >= 75
                ? "75%"
                : deliveryProgress >= 50
                ? "50%"
                : "25%",
          }}
          transition={{ duration: 2 }}
          style={styles.bikeIcon}
        >
          <Text style={{ fontSize: 28 }}>🛵</Text>
        </MotiView>
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          style={styles.mapPin}
        >
          <Icon name="map-pin" size={20} color="#fff" />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.statusBadge}
        >
          <Text style={styles.statusText}>
            {deliveryProgress >= 100
              ? "🎉 Delivered!"
              : deliveryProgress >= 75
              ? "🛵 Out for delivery"
              : deliveryProgress >= 50
              ? "👨‍🍳 Preparing your food"
              : "✅ Order confirmed"}
          </Text>
        </MotiView>
      </MotiView>

      {/* Details Scroll */}
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Restaurant Info */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 26 }}>🍕</Text>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.row}>
                    <Icon name="star" size={14} color="#facc15" />
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    <Text style={styles.cuisineText}>
                      • {restaurant.cuisine.split(",")[0]}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.iconGroup}>
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="phone" size={18} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Icon name="message-circle" size={18} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Delivery Progress */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Delivery Progress</Text>
              <Text style={styles.muted}>
                {Math.min(deliveryProgress, 100)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${deliveryProgress}%` }]}
              />
            </View>
            {deliverySteps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepCircle,
                    step.completed
                      ? { backgroundColor: "#22c55e" }
                      : { backgroundColor: "#ccc" },
                  ]}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    {step.completed ? "✓" : i + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    { color: step.completed ? "#000" : "#777" },
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </MotiView>

        {/* Delivery Address */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Icon name="navigation" size={16} color="#007AFF" />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <Text style={styles.muted}>Sector 18, Noida, Uttar Pradesh</Text>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Order Summary */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <Text style={styles.badge}>Prepaid</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.muted}>Total Amount</Text>
              <Text style={styles.sectionTitle}>₹{finalTotal}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.muted}>Payment Method</Text>
              <Text style={styles.sectionTitle}>Wallet</Text>
            </View>
          </View>
        </MotiView>

        {/* Help */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={[styles.card, styles.helpCard]}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 24, marginRight: 10 }}>💬</Text>
                <View>
                  <Text style={styles.helpTitle}>Need Help?</Text>
                  <Text style={styles.helpText}>
                    Chat with our support team for assistance
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </MotiView>

        {/* Delivered Message */}
        {deliveryProgress >= 100 && (
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={[styles.card, styles.deliveredCard]}
          >
            <Text style={styles.deliveredIcon}>✓</Text>
            <Text style={styles.deliveredTitle}>Order Delivered!</Text>
            <Text style={styles.deliveredText}>
              Enjoy your meal from {restaurant.name}
            </Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.rateBtn}>
                <Text style={styles.rateText}>Rate Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reorderBtn}>
                <Text style={styles.reorderText}>Order Again</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#007AFF",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backButton: { marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  orderId: { color: "#e0e0e0", fontSize: 12 },
  mapContainer: {
    height: 200,
    backgroundColor: "#cde7ff",
    position: "relative",
    overflow: "hidden",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    opacity: 0.1,
  },
  pingDot: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: 10,
    height: 10,
    backgroundColor: "#22c55e",
    borderRadius: 10,
  },
  bikeIcon: { position: "absolute" },
  mapPin: {
    position: "absolute",
    bottom: "25%",
    right: "25%",
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 8,
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { color: "#000", fontWeight: "600" },
  scroll: { padding: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    elevation: 2,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  row: { flexDirection: "row", alignItems: "center" },
  restaurantName: { fontWeight: "600", fontSize: 16 },
  ratingText: { marginLeft: 4, fontSize: 13 },
  cuisineText: { color: "#777", fontSize: 13, marginLeft: 6 },
  iconGroup: { flexDirection: "row", gap: 8 },
  iconButton: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 50,
  },
  sectionTitle: { fontWeight: "600", fontSize: 15 },
  muted: { color: "#777", fontSize: 13 },
  progressBar: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginVertical: 10,
  },
  progressFill: {
    backgroundColor: "#22c55e",
    height: "100%",
    borderRadius: 5,
  },
  stepRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  stepLabel: { fontSize: 14 },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e6f0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  helpCard: { backgroundColor: "#fff7ed", borderColor: "#fed7aa" },
  helpTitle: { color: "#c2410c", fontWeight: "600", fontSize: 14 },
  helpText: { color: "#ea580c", fontSize: 12 },
  helpButton: {
    borderWidth: 1,
    borderColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  helpButtonText: { color: "#c2410c", fontWeight: "600" },
  deliveredCard: { backgroundColor: "#dcfce7", alignItems: "center" },
  deliveredIcon: { fontSize: 40, color: "#16a34a", marginBottom: 8 },
  deliveredTitle: { color: "#166534", fontWeight: "700", fontSize: 18 },
  deliveredText: { color: "#16a34a", fontSize: 13, marginBottom: 8 },
  rateBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  reorderBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  rateText: { color: "#000" },
  reorderText: { color: "#fff" },
});