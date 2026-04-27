import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import Loader from "./Loader";

const Protected = ({ children, role = "buyer" }) => {
  const user = useSelector((state) => state.auth?.user);
  const auth = useSelector((state) => state.auth);

  if (!auth) return null;

  if (auth.loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};
export default Protected;
