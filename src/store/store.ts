import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "../features/cartSlice";
import productSlice from "../features/productSlice";
import categoriesSlice from "../features/categoriesSlice";
import sandookSlice from "../features/sandookSlice";
import wishlistSlice from "../features/wishlistSlice";

export const store = configureStore({
  reducer: {
    product: productSlice,
    category: categoriesSlice,
    cartItem: cartSlice,
    wishlistItem: wishlistSlice,
    sandookItem: sandookSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
