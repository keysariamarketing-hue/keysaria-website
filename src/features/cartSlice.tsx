import { CartItemType } from "@/types/cartItemType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

interface CartState {
  cartData: CartItemType[];
  allCart: CartItemType[];
  status: string | null;
  loading: boolean;
}

// ✅ Initialize state with type safety
const initialState: CartState = {
  cartData:
    typeof window !== "undefined" && localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart") as string)
      : [],
  allCart: [],
  status: null,
  loading: false,
};

// ✅ Async Thunk to add cart data for logged-in users
export const addCartDataThunk = createAsyncThunk<
  CartItemType,
  {
    quantity: number;
    customerId: string;
    productId: string;
    privateAxios: AxiosInstance;
    productStockId: string;
  }
>("cart/addCart", async (details) => {
  const { quantity, customerId, productId, privateAxios, productStockId } =
    details;
  if (customerId) {
    const res = await privateAxios.post(`/customer/cart/add`, {
      quantity,
      customerId,
      productId,
      productStockId,
    });
    return res.data;
  }
  throw new Error("Customer ID is required");
});

// ✅ Async Thunk to fetch cart data for logged-in users
export const fetchCartDataThunk = createAsyncThunk<
  CartItemType[],
  {
    customerId: string;
    privateAxios: AxiosInstance;
  }
>("cart/fetchCart", async (getCart) => {
  const { customerId, privateAxios } = getCart;
  if (customerId) {
    const res = await privateAxios.get(
      `/customer/myCart/getCart/${customerId}`
    );
    return res.data;
  } else {
    return typeof window !== "undefined" && localStorage.getItem("cartData")
      ? JSON.parse(localStorage.getItem("cartData") as string)
      : [];
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Add cart data to localStorage for users who are not logged in
    addToCartWithoutLogin: (state, action: PayloadAction<CartItemType>) => {
      const newCartData = [...state.cartData, action.payload];
      state.cartData = newCartData;
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newCartData));
      }
    },
    // ✅ Reset cart (e.g., on logout)
    resetCart: (state) => {
      state.cartData = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    },
  },
  extraReducers: (builder) => {
    // ✅ Adding cart data (logged-in users)
    builder.addCase(addCartDataThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      addCartDataThunk.fulfilled,
      (state, action: PayloadAction<CartItemType>) => {
        state.cartData.push(action.payload);
        state.loading = false;
      }
    );
    builder.addCase(addCartDataThunk.rejected, (state) => {
      state.loading = false;
    });

    // ✅ Fetching cart data (logged-in users)
    builder.addCase(fetchCartDataThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCartDataThunk.fulfilled,
      (state, action: PayloadAction<CartItemType[]>) => {
        state.allCart = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(fetchCartDataThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});

// ✅ Export actions
export const { addToCartWithoutLogin, resetCart } = cartSlice.actions;

// ✅ Export reducer
export default cartSlice.reducer;
