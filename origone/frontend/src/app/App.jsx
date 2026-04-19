import { useSelector } from "react-redux";
import Loader from "../features/auth/components/Loader";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import "./App.css";

function App() {
  const { handleGetUser } = useAuth();
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    handleGetUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <RouterProvider router={routes} />;
}

export default App