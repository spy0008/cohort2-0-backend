import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductsApi } from "../service/shop.api";
import { deleteProductThunk } from "../../seller/product/state/productSlice";

export const fetchProducts = createAsyncThunk(
  "shop/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const data = await getProductsApi(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  },
);

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    products: [],
    loading: false,
    page: 1,
    pages: 1,
    total: 0,
    filters: {
      search: "",
      minPrice: "",
      maxPrice: "",
      sort: "new",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const { setFilters, setPage } = shopSlice.actions;
export default shopSlice.reducer;
