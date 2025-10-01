import axios from "@/app/api/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

// ✅ Define Types for Category Data
interface Category {
  id: string;
  catName: string;
  image?: string;
}

interface CategoryState {
  categories: Category[];
  customerCat: Category[];
  singleCat?: Category;
  status: string | null;
  loading: boolean;
}

// ✅ Initial State with Proper Types
const initialState: CategoryState = {
  categories: [],
  customerCat: [],
  singleCat: undefined,
  status: null,
  loading: false,
};

// ✅ Fetch Categories (Admin)
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (data: {
    search?: string;
    active?: boolean;
    page?: number;
    pageSize?: number;
    privateAxios: AxiosInstance;
  }) => {
    const { search, active, page, pageSize, privateAxios } = data;
    const res = await privateAxios.get("/adminStaff/categories", {
      params: { search, active, page, pageSize },
    });
    return res.data.getAllCategories as Category[];
  }
);

// ✅ Fetch Customer Categories
export const fetchCustomerCategories = createAsyncThunk(
  "category/getAllCategories",
  async () => {
    const res = await axios.get("/customer/getAllCategories");
    return res.data.getAllCategories as Category[];
  }
);

// ✅ Get Single Category
export const getSingleCateThunk = createAsyncThunk(
  "category/getSingleCateThunk",
  async (cateId: string) => {
    console.log("Fetching Category ID:", cateId);
    const res = await axios.get(`/adminStaff/categorie/${cateId}`);
    return res.data.getCategories as Category;
  }
);

// ✅ Update Category
export const updateCategoriesThunk = createAsyncThunk(
  "category/updateCategoriesThunk",
  async ({
    cateId,
    catName,
    image,
  }: {
    cateId: string;
    catName: string;
    image?: File;
  }) => {
    console.log("Updating Category:", cateId, catName, image);

    const formData = new FormData();
    formData.append("catName", catName);
    if (image) formData.append("image", image);

    const res = await axios.post(
      `/adminStaff/categorie/update/${cateId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    return res.data.getAllCategories as Category[];
  }
);

// ✅ Delete Category
export const deleteCategoriesThunk = createAsyncThunk(
  "category/deleteCategoriesThunk",
  async (id: string) => {
    const res = await axios.delete(`/adminStaff/categorie/delete/${id}`);
    return res.data.getAllCategories as Category[];
  }
);

// ✅ Create Slice
const categoriesSlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.categories = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(fetchCustomerCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCustomerCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.customerCat = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCustomerCategories.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getSingleCateThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getSingleCateThunk.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.singleCat = action.payload;
          state.loading = false;
        }
      )
      .addCase(getSingleCateThunk.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateCategoriesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateCategoriesThunk.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.categories = action.payload;
          state.loading = false;
        }
      )
      .addCase(updateCategoriesThunk.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deleteCategoriesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteCategoriesThunk.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.categories = action.payload;
          state.loading = false;
        }
      )
      .addCase(deleteCategoriesThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ✅ Export the reducer
export default categoriesSlice.reducer;
