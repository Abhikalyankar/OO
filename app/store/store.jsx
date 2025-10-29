import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
// import themeSlice from "./ui/themeSlice";
// import cameraSlice from "./camera/cameraSlice";
// import registrySlice from "./registry/registrySlice";
// import locationSlice from "./locations/locationSclice";
// import archivesSlice from "./archives/archivesSlice";
// import buildingSlice from "./buildings/buildingSclice";
// import floorSlice from "./floors/floorSlice";
// import bucketSlice from "./Bucket/bucketSlice";
// import usersReducer from "./users/usersSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    // theme: themeSlice.reducer,
    // camera: cameraSlice.reducer,
    // registry: registrySlice.reducer,
    // location: locationSlice.reducer,
    // archives: archivesSlice.reducer,
    // buildings: buildingSlice.reducer,
    // floors: floorSlice.reducer,
    // bucket: bucketSlice.reducer,
    // users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check to avoid errors with non-serializable data in thunks
      serializableCheck: false,
    }),
});

export default store;
