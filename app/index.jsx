import { Stack } from "expo-router";
import {
  Home,
  MessageCircle,
  Package,
  QrCode,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// === SCREENS ===
import ChatScreen from "./components/ChatScreen";
import GroceryScreen from "./components/GroceryScreen";
import HomeScreen from "./components/HomeScreen";
import HomeServicesScreen from "./components/HomeServicesScreen";
import MedicineScreen from "./components/MedicineScreen";
import OrdersScreen from "./components/OrdersScreen";
import PaymentsScreen from "./components/PaymentsScreen";
import ProfileScreen from "./components/ProfileScreen";
import QRScanner from "./components/QRScanner";
import RideScreen from "./components/RideScreen";
import SignInScreen from "./components/SignInScreen";
import SignUpScreen from "./components/SignUpScreen";
import SubscriptionsScreen from "./components/SubscriptionsScreen";
import WelcomeScreen from "./components/WelcomeScreen";

// === FOOD FLOW ===
import RestaurantList from "./components/food/RestaurantList";
import FoodMenu from "./components/food/FoodMenu";
import FoodCheckout from "./components/food/FoodCheckout";
import FoodTracking from "./components/food/FoodTracking";

export default function App() {
  // ===== GLOBAL STATES =====
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [authScreen, setAuthScreen] = useState("welcome");
  const [activeScreen, setActiveScreen] = useState("home");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // ===== FOOD FLOW STATES =====
  const [foodView, setFoodView] = useState("restaurants");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ===== STATIC DATA =====
  const restaurants = [
    { id: "1", name: "Pizza Hut", cuisine: "Italian", rating: 4.3, deliveryTime: "25–30 min" },
    { id: "2", name: "Burger King", cuisine: "Fast Food", rating: 4.2, deliveryTime: "20–25 min" },
  ];

  const menuItems = [
    {
      id: "1",
      name: "Margherita Pizza",
      price: 299,
      rating: 4.5,
      veg: true,
      description: "Classic mozzarella and tomato base",
      image: "https://images.unsplash.com/photo-1601924638867-3ec3e602b86b?w=200",
    },
    {
      id: "2",
      name: "Pepperoni Pizza",
      price: 399,
      rating: 4.6,
      veg: false,
      description: "Topped with spicy pepperoni slices",
      image: "https://images.unsplash.com/photo-1594007654729-407eedc4be66?w=200",
    },
  ];

  // ===== EFFECTS =====
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, [activeScreen]);

  // ===== AUTH HANDLERS =====
  const handleWelcomeComplete = () => {
    setIsFirstTime(false);
    setAuthScreen("signin");
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsAuthenticated(true);
    setActiveScreen("home");
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsAuthenticated(true);
    setActiveScreen("home");
    setIsLoading(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAuthScreen("signin");
    setActiveScreen("home");
    setShowQRScanner(false);
  };

  // ===== FOOD CART HANDLERS =====
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const getCartTotal = () => cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const getItemQuantity = (id) => cart.find((i) => i.id === id)?.quantity || 0;

  // ===== FOOD NAVIGATION =====
  const handleRestaurantClick = (r) => {
    setSelectedRestaurant(r);
    setFoodView("menu");
  };
  const handleCheckout = () => setFoodView("checkout");
  const handlePlaceOrder = () => {
    setAppliedCoupon(null);
    setCart([]);
    setFoodView("tracking");
  };
  const handleFoodBack = () => {
    if (foodView === "tracking") setFoodView("checkout");
    else if (foodView === "checkout") setFoodView("menu");
    else if (foodView === "menu") setFoodView("restaurants");
    else setActiveScreen("home");
  };

  // ===== COUPON HANDLING =====
  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "OFF10") {
      setAppliedCoupon({ code: "OFF10", discount: getCartTotal() * 0.1 });
      Alert.alert("✅ 10% discount applied!");
    } else if (code === "SAVE50") {
      setAppliedCoupon({ code: "SAVE50", discount: 50 });
      Alert.alert("✅ ₹50 discount applied!");
    } else {
      Alert.alert("❌ Invalid coupon code");
    }
    setCouponCode("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    Alert.alert("🗑️ Coupon removed");
  };

  const getFinalTotal = () => {
    if (appliedCoupon) {
      const total = getCartTotal() - appliedCoupon.discount;
      return Math.max(total, 0);
    }
    return getCartTotal();
  };

  // ===== AUTH FLOW =====
  if (!isAuthenticated) {
    if (isFirstTime && authScreen === "welcome")
      return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    if (authScreen === "signin")
      return (
        <SignInScreen
          onSignIn={handleSignIn}
          onNavigateToSignUp={() => setAuthScreen("signup")}
          isLoading={isLoading}
        />
      );
    return (
      <SignUpScreen
        onSignUp={handleSignUp}
        onNavigateToSignIn={() => setAuthScreen("signin")}
        isLoading={isLoading}
      />
    );
  }

  // ===== MAIN CONTENT RENDER =====
  const renderScreen = () => {
    if (activeScreen === "food") {
      if (foodView === "restaurants")
        return (
          <RestaurantList
            onNavigate={setActiveScreen}
            onRestaurantSelect={handleRestaurantClick}
          />
        );
      if (foodView === "menu")
        return (
          <FoodMenu
            restaurant={selectedRestaurant}
            cart={cart}
            onBack={handleFoodBack}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onCheckout={handleCheckout}
            getItemQuantity={getItemQuantity}
            getCartTotal={getCartTotal}
          />
        );
      if (foodView === "checkout")
        return (
          <FoodCheckout
            restaurant={selectedRestaurant}
            cart={cart}
            onBack={handleFoodBack}
            onPlaceOrder={handlePlaceOrder}
            getCartTotal={getCartTotal}
          />
        );
      if (foodView === "tracking")
        return <FoodTracking restaurant={selectedRestaurant} onBack={handleFoodBack} />;
    }

    const screens = {
      home: <HomeScreen onNavigate={setActiveScreen} />,
      chat: <ChatScreen onNavigate={setActiveScreen} />,
      orders: <OrdersScreen onNavigate={setActiveScreen} />,
      profile: <ProfileScreen onNavigate={setActiveScreen} onSignOut={handleSignOut} />,
      payments: <PaymentsScreen onNavigate={setActiveScreen} />,
      grocery: <GroceryScreen onNavigate={setActiveScreen} />,
      medicine: <MedicineScreen onNavigate={setActiveScreen} />,
      ride: <RideScreen onNavigate={setActiveScreen} />,
      "home-services": <HomeServicesScreen onNavigate={setActiveScreen} />,
      subscriptions: <SubscriptionsScreen onNavigate={setActiveScreen} />,
    };
    return screens[activeScreen] || screens.home;
  };

  // ===== NAV BAR =====
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "orders", icon: Package, label: "Orders" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  // ===== APP LAYOUT =====
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#007bff" barStyle="light-content" />
        <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
          {renderScreen()}
        </Animated.View>

        {showQRScanner && <QRScanner onClose={() => setShowQRScanner(false)} />}

        <View style={styles.navBar}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.navItem}
                onPress={() => setActiveScreen(item.id)}
              >
                <Icon color={isActive ? "#007bff" : "#777"} size={24} />
                <Text
                  style={[
                    styles.navLabel,
                    { color: isActive ? "#007bff" : "#777" },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => setShowQRScanner(true)}
        >
          <QrCode color="white" size={28} />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainContent: { flex: 1 },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 10,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navLabel: { fontSize: 12, marginTop: 2 },
  qrButton: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "#007bff",
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
