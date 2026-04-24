import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice";
import productReducer from "../features/seller/product/state/productSlice";
import dashboardReducer from "../features/seller/product/state/dashboardSlice";
import shopReducer from "../features/shop/state/shopSlice";
import singleProductSlice from "../features/shop/state/SingleProductSlice";
import cartReducer from "../features/cart/state/cart.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    dashboard: dashboardReducer,
    shop: shopReducer,
    singleProduct: singleProductSlice,
    cart: cartReducer,
  },
});
