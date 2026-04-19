import { createBrowserRouter } from "react-router";
import MainLayout from "./MainLayout";

import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Home from "../features/home/pages/Home";
import About from "../features/home/pages/About";
// future: Shop, SellerDashboard etc.

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // 🔥 wrapper

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
        element: <div>Shop Page</div>, // placeholder
      },
      {
        path: "seller",
        element: <div>Seller Dashboard</div>,
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