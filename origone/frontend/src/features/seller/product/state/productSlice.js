import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProductApi,
  getSellerProductsApi,
  deleteProductApi,
  updateProductApi,
} from "../service/product.api";

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

export const deleteProductThunk = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateProductThunk = createAsyncThunk(
  "product/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await updateProductApi(id, formData);
      return res.product;
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

  update: {
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
    resetUpdateState: (state) => {
      state.update = initialState.update;
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
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.list.products = state.list.products.filter(
          (p) => p._id !== action.payload,
        );
      })
      .addCase(updateProductThunk.pending, (state) => {
        state.update.loading = true;
      })
      .addCase(updateProductThunk.fulfilled, (state) => {
        state.update.loading = false;
        state.update.success = true;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.update.loading = false;
        state.update.error = action.payload;
      });
  },
});

export const { resetCreateState, resetUpdateState } = productSlice.actions;
export default productSlice.reducer;
