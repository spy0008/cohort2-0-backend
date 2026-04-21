import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice"
import productReducer from "../features/seller/product/state/productSlice"
import dashboardReducer from "../features/seller/product/state/dashboardSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        dashboard: dashboardReducer
    }
})