import React, { useState, useEffect } from "react";
import RestaurantList from "./food/RestaurantList";
import FoodMenu from "./food/FoodMenu";
import FoodCheckout from "./food/FoodCheckout";
import FoodTracking from "./food/FoodTracking";

export default function FoodScreen({
  onNavigate,
  onOrderPlaced,
  trackingOrder,
  onOrderStatusUpdate,
  onTrackingComplete,
}) {
  const [currentView, setCurrentView] = useState("restaurants");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);

  // When tracking an existing order
  useEffect(() => {
    if (trackingOrder) {
      setCurrentView("tracking");
      setFinalTotal(trackingOrder.amount);
      setSelectedRestaurant({
        id: trackingOrder.id,
        name: trackingOrder.restaurant,
        cuisine: "Various",
        rating: 4.2,
        deliveryTime: trackingOrder.estimatedTime || "25–30 mins",
        image: "",
        distance: "2 km",
        priceForTwo: 400,
      });
    }
  }, [trackingOrder]);

  // ─── Cart helpers ────────────────────────────
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.id === itemId && c.quantity > 1
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const getCartTotal = () =>
    cart.reduce((t, i) => t + i.price * i.quantity, 0);

  const getItemQuantity = (id) =>
    cart.find((i) => i.id === id)?.quantity || 0;

  // ─── Navigation & flow ───────────────────────
  const handleRestaurantSelect = (r) => {
    setSelectedRestaurant(r);
    setCurrentView("menu");
  };

  const handleCheckout = () => {
    if (cart.length > 0) setCurrentView("checkout");
  };

  const handlePlaceOrder = (total) => {
    setFinalTotal(total);
    setCurrentView("tracking");

    if (onOrderPlaced && selectedRestaurant) {
      const order = {
        id: `FOOD${Date.now()}`,
        type: "food",
        status: "placed",
        amount: total,
        createdAt: new Date(),
        estimatedTime: selectedRestaurant.deliveryTime,
        restaurant: selectedRestaurant.name,
        items: cart.map((i) => ({ name: i.name, quantity: i.quantity })),
        itemsText:
          cart.length === 1
            ? cart[0].name
            : `${cart[0].name} + ${cart.length - 1} more`,
        deliveryAddress: "Sector 18, Noida",
      };
      onOrderPlaced(order);
    }
  };

  const handleBack = () => {
    if (currentView === "tracking") {
      if (trackingOrder) {
        onTrackingComplete?.();
        onNavigate("orders");
      } else setCurrentView("checkout");
    } else if (currentView === "checkout") {
      setCurrentView("menu");
    } else if (currentView === "menu") {
      setCurrentView("restaurants");
      setSelectedRestaurant(null);
    } else {
      onNavigate("home");
    }
  };

  // ─── Render logic ────────────────────────────
  if (currentView === "restaurants") {
    return (
      <RestaurantList
        onNavigate={onNavigate}
        onRestaurantSelect={handleRestaurantSelect}
      />
    );
  }

  if (currentView === "menu" && selectedRestaurant) {
    return (
      <FoodMenu
        restaurant={selectedRestaurant}
        cart={cart}
        onBack={handleBack}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onCheckout={handleCheckout}
        getItemQuantity={getItemQuantity}
        getCartTotal={getCartTotal}
      />
    );
  }

  if (currentView === "checkout" && selectedRestaurant) {
    return (
      <FoodCheckout
        restaurant={selectedRestaurant}
        cart={cart}
        onBack={handleBack}
        onPlaceOrder={handlePlaceOrder}
        getCartTotal={getCartTotal}
      />
    );
  }

  if (currentView === "tracking" && selectedRestaurant) {
    return (
      <FoodTracking
        restaurant={selectedRestaurant}
        finalTotal={finalTotal || getCartTotal()}
        onBack={handleBack}
        orderId={trackingOrder?.id}
        onOrderComplete={(id) =>
          onOrderStatusUpdate?.(id, "completed")
        }
      />
    );
  }

  // fallback
  return (
    <RestaurantList
      onNavigate={onNavigate}
      onRestaurantSelect={handleRestaurantSelect}
    />
  );
}
