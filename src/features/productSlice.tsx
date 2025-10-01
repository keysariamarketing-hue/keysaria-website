import axios from "@/app/api/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Define Product Type
interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
}

// ✅ Define Redux State
interface ProductState {
  products: Product[];
  status: string | null;
  loading: boolean;
}

// ✅ Initial State with Proper Typing
const initialState: ProductState = {
  products: [],
  status: null,
  loading: false,
};

// ✅ Fetch Product Thunk (Admin)
export const fetchProduct = createAsyncThunk<Product[], string>(
  "product/productFetch",
  async (name) => {
    const res = await axios.get(`/adminStaff/products/${name}`);
    return res.data.getAllProducts as Product[];
  }
);

// ✅ Create Redux Slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProduct.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.products = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchProduct.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ✅ Export Reducer
export default productSlice.reducer;
