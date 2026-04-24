import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyOrdersApi, getOrderByIdApi } from "../services/order.api";

// 🔥 FETCH MY ORDERS
export const fetchMyOrders = createAsyncThunk(
  "orders/getMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyOrdersApi();
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  "orders/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getOrderByIdApi(id);
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    selectedOrder: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
