import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
// react-native-maps is native-only and will break web builds if imported on web.
// Load it conditionally at runtime only on native platforms.
const isNative = Platform.OS !== "web";
import * as Location from "expo-location";
import { MotiView } from "moti";
import { ArrowLeft, MapPin } from "lucide-react-native";

export default function FoodTracking({ handleBack }) {
  const [userLocation, setUserLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== Simulate Delivery Boy Moving =====
  useEffect(() => {
    (async () => {
      // Ask for location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied for location tracking!");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Start delivery location slightly away
      let delivery = {
        latitude: latitude + 0.01,
        longitude: longitude - 0.01,
      };
      setDeliveryLocation(delivery);
      setLoading(false);

      // Simulate movement every 3 sec
      const interval = setInterval(() => {
        delivery = {
          latitude: delivery.latitude - 0.0005,
          longitude: delivery.longitude + 0.0005,
        };
        setDeliveryLocation({ ...delivery });
      }, 3000);

      return () => clearInterval(interval);
    })();
  }, []);

  // Dynamically import react-native-maps only on native platforms to avoid
  // bundling native-only modules on web.
  const [mapLib, setMapLib] = useState(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isNative) return;
      try {
        const RNM = await import("react-native-maps");
        if (!mounted) return;
        const MV = RNM.default || RNM;
        setMapLib({ MapView: MV, Marker: RNM.Marker, Polyline: RNM.Polyline });
      } catch (e) {
        console.warn("Failed to load react-native-maps:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !userLocation || !deliveryLocation) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Order Tracking</Text>
        </View>
      </MotiView>

      {/* Map (conditionally render only on native platforms) */}
      {isNative ? (
        mapLib ? (
          <mapLib.MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {/* User Marker */}
            <mapLib.Marker coordinate={userLocation} title="You" pinColor="blue" />

            {/* Delivery Boy Marker */}
            <mapLib.Marker
              coordinate={deliveryLocation}
              title="Delivery Partner"
              pinColor="red"
            >
              <View style={styles.deliveryMarker}>
                <MapPin color="white" size={18} />
              </View>
            </mapLib.Marker>

            {/* Route Line */}
            <mapLib.Polyline
              coordinates={[userLocation, deliveryLocation]}
              strokeColor="#007bff"
              strokeWidth={3}
            />
          </mapLib.MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={{ marginTop: 8 }}>Loading map library...</Text>
          </View>
        )
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text style={{ fontWeight: "600", marginBottom: 8 }}>Map is not available on web</Text>
          <Text>Current location: {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}</Text>
          <Text>Delivery location: {deliveryLocation.latitude.toFixed(5)}, {deliveryLocation.longitude.toFixed(5)}</Text>
        </View>
      )}

      {/* Delivery Status */}
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>🚴 Delivery Partner is on the way!</Text>
        <Text style={styles.subText}>Arriving soon at your location</Text>
      </View>
    </View>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { backgroundColor: "#007bff", padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  map: { flex: 1 },
  deliveryMarker: {
    backgroundColor: "#FF3B30",
    padding: 6,
    borderRadius: 50,
  },
  statusBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusText: { fontSize: 16, fontWeight: "600", color: "#007bff" },
  subText: { fontSize: 13, color: "#666", marginTop: 4 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
