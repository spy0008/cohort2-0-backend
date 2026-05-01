import { useSelector } from "react-redux";
import Loader from "../features/auth/components/Loader";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";
import { setLogoutHandler } from "../shared/lib/axios";
import { useDispatch } from "react-redux";
import { setClearUser } from "../features/auth/state/auth.slice";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import "./App.css";

function App() {
  const { handleGetUser } = useAuth();
  const loading = useSelector((state) => state.auth?.loading ?? true);

  const dispatch = useDispatch();

  useEffect(() => {
    setLogoutHandler(() => {
      dispatch(setClearUser());
    });
  }, [dispatch]);

  useEffect(() => {
    handleGetUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <RouterProvider router={routes} />;
}

export default App;
