import { Wishlist } from "@/types/wishlistType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

// ✅ Define Redux State
interface WishlistState {
  allWishlist: Wishlist[];
  status: string | null;
  loading: boolean;
}

// ✅ Initial State with Proper Typing
const initialState: WishlistState = {
  allWishlist: [],
  status: null,
  loading: false,
};

// ✅ Add Wishlist Data Thunk
export const addWishlistDataThunk = createAsyncThunk<
  Wishlist,
  { customerId: string; productId: string; privateAxios: AxiosInstance }
>(
  "customer/product/wishlist",
  async ({ customerId, productId, privateAxios }) => {
    console.log("Adding to Wishlist:", { customerId, productId });

    const res = await privateAxios.post(`/wishlist/createWishlistItem`, {
      customerId,
      productId,
    });

    return res.data as Wishlist;
  }
);

// ✅ Fetch Wishlist Data Thunk
export const fetchWishlistDataThunk = createAsyncThunk<
  Wishlist[],
  { customerId: string; privateAxios: AxiosInstance }
>("customer/wishlist/view", async ({ customerId, privateAxios }) => {
  if (customerId !== undefined) {
    console.log("Fetching Wishlist for Customer:", customerId);
    const res = await privateAxios.get(
      `/wishlist/getWishlistByCustomer/${customerId}`
    );
    return res.data as Wishlist[];
  }
  return [];
});

// ✅ Create Redux Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Wishlist>) => {
      state.allWishlist.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addWishlistDataThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addWishlistDataThunk.fulfilled,
        (state, action: PayloadAction<Wishlist>) => {
          state.allWishlist.push(action.payload);
          state.loading = false;
        }
      )
      .addCase(addWishlistDataThunk.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(fetchWishlistDataThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchWishlistDataThunk.fulfilled,
        (state, action: PayloadAction<Wishlist[]>) => {
          state.allWishlist = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchWishlistDataThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ✅ Export Actions & Reducer
export const { addToWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
