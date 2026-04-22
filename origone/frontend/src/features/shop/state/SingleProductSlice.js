import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSingleProductApi } from "../service/product.api";

export const fetchProduct = createAsyncThunk(
  "product/fetchSingle",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getSingleProductApi(id);
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  },
);

const SingleProductSlice = createSlice({
  name: "singleProduct",
  initialState: {
    product: null,
    loading: false,
    selectedImage: "",
    selectedVariant: null,
  },
  reducers: {
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },
    setSelectedVariant: (state, action) => {
      state.selectedVariant = action.payload;
      state.selectedImage = action.payload?.images?.[0]?.url || "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.selectedImage = action.payload.images?.[0]?.url || "";
      })
      .addCase(fetchProduct.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedImage, setSelectedVariant } =
  SingleProductSlice.actions;

export default SingleProductSlice.reducer;
