import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createPaymentApi, verifyPaymentApi } from "../services/checkout.api";

// CREATE ORDER
export const createPayment = createAsyncThunk(
  "checkout/createPayment",
  async (_, { rejectWithValue }) => {
    try {
      const res = await createPaymentApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

// VERIFY PAYMENT
export const verifyPayment = createAsyncThunk(
  "checkout/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await verifyPaymentApi(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    loading: false,
    order: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPayment.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;

        localStorage.setItem("lastOrder", JSON.stringify(action.payload.order));
      })
      .addCase(verifyPayment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default checkoutSlice.reducer;
