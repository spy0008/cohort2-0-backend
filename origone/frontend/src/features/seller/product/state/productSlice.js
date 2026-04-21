import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createProductApi, getSellerProductsApi } from "../service/product.api";

export const createProductThunk = createAsyncThunk(
  "product/create",
  async (formData, { rejectWithValue }) => {
    try {
      return await createProductApi(formData);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchSellerProducts = createAsyncThunk(
  "product/fetchSeller",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSellerProductsApi();
      return res.products;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const initialState = {
  create: {
    loading: false,
    success: false,
    error: null,
  },

  list: {
    loading: false,
    products: [],
    error: null,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetCreateState: (state) => {
      state.create = initialState.create;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProductThunk.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.success = true;

        if (state.list.products) {
          state.list.products.unshift(action.payload.product);
        }
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload;
      })
      .addCase(fetchSellerProducts.pending, (state) => {
        state.list.loading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload;
      });
  },
});

export const { resetCreateState } = productSlice.actions;
export default productSlice.reducer;
