import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWalletApi,
  getTransactionsApi,
  withdrawApi,
} from "../services/wallet.api";

export const fetchWallet = createAsyncThunk(
  "wallet/get",
  async (_, { rejectWithValue }) => {
    try {
      return await getWalletApi();
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  "wallet/txns",
  async (_, { rejectWithValue }) => {
    try {
      return await getTransactionsApi();
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const withdrawThunk = createAsyncThunk(
  "wallet/withdraw",
  async (_, { rejectWithValue }) => {
    try {
      return await withdrawApi();
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallet: null,
    transactions: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions;
      })
      .addCase(withdrawThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(withdrawThunk.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default walletSlice.reducer;