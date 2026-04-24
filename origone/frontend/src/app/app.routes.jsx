import { createBrowserRouter } from "react-router";
import MainLayout from "./MainLayout";

import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Home from "../features/home/pages/Home";
import About from "../features/home/pages/About";
import CreateProduct from "../features/seller/product/pages/CreateProduct";
import Protected from "../features/auth/components/Protected";
import SellerProductsPage from "../features/seller/product/pages/SellerProduct";
import SellerDashboard from "../features/seller/product/pages/SellerDashboard";
import ShopPage from "../features/shop/pages/ShopPage";
import ProductDetailPage from "../features/shop/pages/ProductDetailPage";
import CartPage from "../features/cart/pages/CartPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "shop/product/:id",
        element: <ProductDetailPage />,
      },
       {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "seller/dashboard/create-product",
        element: (
          <Protected role="seller">
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "seller/dashboard/my-vault",
        element: (
          <Protected role="seller">
            <SellerProductsPage />
          </Protected>
        ),
      },
      {
        path: "seller/dashboard",
        element: (
          <Protected role="seller">
            <SellerDashboard />
          </Protected>
        ),
      },
      {
        path: "seller/dashboard/edit-product/:id",
        element: (
          <Protected role="seller">
            <CreateProduct />
          </Protected>
        ),
      },
    ],
  },

  // 🔥 auth pages WITHOUT navbar/footer
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
