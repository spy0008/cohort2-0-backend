import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateBankApi } from "../service/auth.api";

export const updateBankThunk = createAsyncThunk(
  "auth/updateBank",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateBankApi(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setClearUser: (state, action) => {
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateBankThunk.fulfilled, (state) => {
      if (state.user) {
        state.user.bankDetails = {
          ...state.user.bankDetails,
          isVerified: true,
        };
      }
    });
  },
});

export const { setError, setLoading, setUser, setClearUser } =
  authSlice.actions;
export default authSlice.reducer;
