import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashborad from "../features/chat/pages/Dashborad";
import Protected from "../features/auth/components/Protected";
import EmailVerify from "../features/auth/pages/EmailVerify";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Dashborad />
      </Protected>
    ),
  },
  {
    path: "/verify-email",
    element: (
        <EmailVerify />
    ),
  },
]);
