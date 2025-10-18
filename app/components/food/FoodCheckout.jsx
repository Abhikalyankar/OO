import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { MotiView } from "moti";
import Icon from "react-native-vector-icons/Feather";

export default function FoodCheckout({
  restaurant,
  cart,
  onBack,
  onPlaceOrder,
  getCartTotal,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState("standard");

  const availableCoupons = [
    { code: "SAVE50", discount: 50, minOrder: 300, description: "Save ₹50 on ₹300+" },
    { code: "FIRST100", discount: 100, minOrder: 500, description: "Flat ₹100 off" },
  ];

  const deliveryTimeSlots = [
    { id: "standard", label: "Standard", time: restaurant.deliveryTime, price: 0 },
    { id: "express", label: "Express", time: "15-20 mins", price: 30 },
    { id: "schedule", label: "Schedule", time: "Choose time", price: 0 },
  ];

  const applyCoupon = () => {
    const coupon = availableCoupons.find(
      (c) => c.code === couponCode.toUpperCase()
    );
    if (coupon && getCartTotal() >= coupon.minOrder) {
      setAppliedCoupon({ code: coupon.code, discount: coupon.discount });
      setCouponCode("");
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const getDeliveryFee = () => {
    const slot = deliveryTimeSlots.find((s) => s.id === selectedDeliveryTime);
    return slot?.price || 0;
  };

  const getFinalTotal = () => {
    const subtotal = getCartTotal();
    const discount = appliedCoupon?.discount || 0;
    const deliveryFee = getDeliveryFee();
    return subtotal - discount + deliveryFee;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Review Order</Text>
          <Text style={styles.headerSubtitle}>{restaurant.name}</Text>
        </View>
      </MotiView>

      {/* Scrollable Content */}
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Order Items */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="package" size={16} color="#007AFF" />
              <Text style={styles.sectionTitle}>Your Order</Text>
            </View>
            {cart.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>x {item.quantity}</Text>
                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
          </View>
        </MotiView>

        {/* Delivery Time */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="clock" size={16} color="#007AFF" />
              <Text style={styles.sectionTitle}>Delivery Time</Text>
            </View>

            {deliveryTimeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                onPress={() => setSelectedDeliveryTime(slot.id)}
                style={[
                  styles.deliveryOption,
                  selectedDeliveryTime === slot.id && styles.deliverySelected,
                ]}
              >
                <Text style={styles.deliveryText}>
                  {slot.label} - {slot.time}
                </Text>
                <Text style={styles.deliveryPrice}>
                  {slot.price > 0 ? `+₹${slot.price}` : "Free"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </MotiView>

        {/* Coupon */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="percent" size={16} color="#28a745" />
              <Text style={styles.sectionTitle}>Apply Coupon</Text>
            </View>

            {appliedCoupon ? (
              <View style={styles.couponApplied}>
                <View style={styles.row}>
                  <Icon name="tag" size={16} color="#28a745" />
                  <Text style={styles.couponText}>
                    {appliedCoupon.code} - Saved ₹{appliedCoupon.discount}
                  </Text>
                </View>
                <TouchableOpacity onPress={removeCoupon}>
                  <Icon name="x" size={20} color="#28a745" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.couponRow}>
                  <TextInput
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChangeText={setCouponCode}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={applyCoupon}
                    disabled={!couponCode}
                  >
                    <Text style={styles.applyText}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {availableCoupons.map((coupon) => (
                  <TouchableOpacity
                    key={coupon.code}
                    onPress={() => setCouponCode(coupon.code)}
                    style={styles.couponBox}
                  >
                    <View style={styles.row}>
                      <Icon name="tag" size={16} color="#007AFF" />
                      <View>
                        <Text style={styles.couponCode}>{coupon.code}</Text>
                        <Text style={styles.couponDesc}>{coupon.description}</Text>
                      </View>
                    </View>
                    <Icon name="chevron-right" size={16} color="#666" />
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </MotiView>

        {/* Bill Summary */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1 }}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Bill Summary</Text>
            <View style={styles.billRow}>
              <Text>Item Total</Text>
              <Text>₹{getCartTotal()}</Text>
            </View>
            {getDeliveryFee() > 0 && (
              <View style={styles.billRow}>
                <Text>Delivery Fee</Text>
                <Text>₹{getDeliveryFee()}</Text>
              </View>
            )}
            {appliedCoupon && (
              <View style={styles.billRow}>
                <Text>Coupon Discount</Text>
                <Text style={{ color: "green" }}>-₹{appliedCoupon.discount}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.billRow}>
              <Text style={styles.totalText}>Total Amount</Text>
              <Text style={styles.totalText}>₹{getFinalTotal()}</Text>
            </View>
          </View>
        </MotiView>
      </ScrollView>

      {/* Footer */}
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={styles.footer}
      >
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={() => onPlaceOrder(getFinalTotal())}
        >
          <Text style={styles.placeOrderText}>Place Order ₹{getFinalTotal()}</Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "#007AFF", padding: 16, flexDirection: "row", alignItems: "center" },
  backButton: { marginRight: 12 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerSubtitle: { color: "#e0e0e0", fontSize: 12 },
  scroll: { padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 16, elevation: 2 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 6 },
  sectionTitle: { fontWeight: "600", fontSize: 14 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  itemName: { fontSize: 14 },
  itemQty: { fontSize: 13, color: "#666" },
  itemPrice: { fontWeight: "600" },
  deliveryOption: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginVertical: 4 },
  deliverySelected: { borderColor: "#007AFF", backgroundColor: "#e6f0ff" },
  deliveryText: { fontSize: 14 },
  deliveryPrice: { fontSize: 14, fontWeight: "600" },
  couponRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 },
  applyBtn: { backgroundColor: "#007AFF", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  applyText: { color: "#fff", fontWeight: "600" },
  couponBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginVertical: 4 },
  couponApplied: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#e6ffe6", padding: 10, borderRadius: 8 },
  couponText: { color: "#28a745", fontWeight: "600" },
  billRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 6 },
  totalText: { fontWeight: "700" },
  footer: { position: "absolute", bottom: 0, width: "100%", padding: 12, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#ccc" },
  placeOrderBtn: { backgroundColor: "#007AFF", padding: 14, borderRadius: 8, alignItems: "center" },
  placeOrderText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
