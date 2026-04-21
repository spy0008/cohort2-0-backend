import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDashboardApi,
  getRevenueApi,
  getSellerOrdersApi,
} from "../service/dashboard.api";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const [stats, revenue, orders] = await Promise.all([
        getDashboardApi(),
        getRevenueApi(),
        getSellerOrdersApi(),
      ]);

      return {
        stats: stats.stats,
        revenue: revenue.revenue,
        orders: orders.orders,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    stats: {},
    revenue: 0,
    orders: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.revenue = action.payload.revenue;
        state.orders = action.payload.orders;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;