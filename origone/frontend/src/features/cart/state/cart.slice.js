import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCartApi, getCartApi, updateCartApi } from "../services/cart.api";

export const fetchCart = createAsyncThunk(
  "cart/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCartApi();
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const addCart = createAsyncThunk(
  "cart/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await addToCartApi(payload);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateCart = createAsyncThunk(
  "cart/update",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await updateCartApi(payload);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: { items: [] },
    loadingMap: {},
  },

  reducers: {
    optimisticAdd: (state, action) => {
      const { productId, size, color, productData } = action.payload;

      const existing = state.cart.items.find(
        (i) =>
          (i.product?._id || i.product) === productId &&
          i.size === size &&
          i.color === color,
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.items.push({
          product: {
            _id: productData._id,
            title: productData.title,
            price: productData.price,
            images: productData.images || [],
            variants: productData.variants || [],
          },
          size,
          color,
          quantity: 1,
        });
      }
    },

    removeItem: (state, action) => {
      const { productId, size, color } = action.payload;

      const getId = (p) => (typeof p === "object" ? p._id : p);

      state.cart.items = state.cart.items.filter(
        (i) =>
          !(
            getId(i.product) === productId &&
            i.size === size &&
            i.color === color
          ),
      );
    },

    updateQtyLocal: (state, action) => {
      const { productId, size, color, quantity } = action.payload;

      const getId = (p) => (typeof p === "object" ? p._id : p);

      const item = state.cart.items.find(
        (i) =>
          getId(i.product) === productId &&
          i.size === size &&
          i.color === color,
      );

      if (item) {
        item.quantity = quantity;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(addCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(updateCart.pending, (state, action) => {
        const { productId, size, color } = action.meta.arg;
        state.loadingMap[`${productId}-${size}-${color}`] = true;
      })

      .addCase(updateCart.fulfilled, (state, action) => {
        const hasFullProduct = action.payload?.items?.[0]?.product?.title;

        if (hasFullProduct) {
          state.cart = action.payload;
        }

        const { productId, size, color } = action.meta.arg;
        delete state.loadingMap[`${productId}-${size}-${color}`];
      });
  },
});

export const { optimisticAdd, removeItem, updateQtyLocal } = cartSlice.actions;
export default cartSlice.reducer;
