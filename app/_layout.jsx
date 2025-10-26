import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../store/store.jsx";
// import { store } from "expo-router/build/global-state/router-store";

export default function RootLayout() {
  // debug: confirm this layout mounts and store is available
  // Metro/logs will show this when the layout renders
  console.log("RootLayout mounted. store:", store);
  return (
    <Provider store={store}>
      <Stack />
    </Provider>
  );
}
