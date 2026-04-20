import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice"
import productReducer from "../features/seller/product/state/productSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer
    }
})