import { SandokProduct } from "@/types/sandookType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

// ✅ Define Redux State
interface SandookState {
  sandookData: SandokProduct[];
  allSandook: SandokProduct[];
  status: string | null;
  loading: boolean;
}

// ✅ Initial State with Proper Typing
const initialState: SandookState = {
  sandookData: [],
  allSandook: [],
  status: null,
  loading: false,
};

// ✅ Add Sandook Data Thunk
export const addSandookDataThunk = createAsyncThunk<
  SandokProduct,
  {
    sandokId: string;
    productId: string;
    productStockId: string;
    quantity: number;
    privateAxios: AxiosInstance;
  }
>(
  "customer/addSandook",
  async ({ sandokId, productId, productStockId, quantity, privateAxios }) => {
    console.log("Adding to Sandook:", {
      sandokId,
      productId,
      productStockId,
      quantity,
    });

    const res = await privateAxios.post(`/sandookProduct/createSandokProduct`, {
      sandokId,
      productId,
      productStockId,
      quantity,
    });

    return res.data as SandokProduct;
  }
);

// ✅ Fetch Sandook Data Thunk
export const fetchSandookDataThunk = createAsyncThunk<
  SandokProduct[],
  { customerId: string; privateAxios: AxiosInstance }
>("customer/sandook/view", async ({ customerId, privateAxios }) => {
  if (customerId !== undefined) {
    console.log("Fetching Sandook for Customer:", customerId);
    const res = await privateAxios.get(
      `/sandook/getSandokByCustomerId/${customerId}`
    );
    return res.data.sandokProduct as SandokProduct[];
  }
  return [];
});

// ✅ Create Redux Slice
const sandookSlice = createSlice({
  name: "Sandook",
  initialState,
  reducers: {
    addToSandook: (state, action: PayloadAction<SandokProduct>) => {
      state.sandookData.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSandookDataThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        addSandookDataThunk.fulfilled,
        (state, action: PayloadAction<SandokProduct>) => {
          state.sandookData.push(action.payload);
          state.loading = false;
        }
      )
      .addCase(addSandookDataThunk.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(fetchSandookDataThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchSandookDataThunk.fulfilled,
        (state, action: PayloadAction<SandokProduct[]>) => {
          state.allSandook = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchSandookDataThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ✅ Export Actions & Reducer
export const { addToSandook } = sandookSlice.actions;
export default sandookSlice.reducer;
