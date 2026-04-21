import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../state/dashboardSlice";

export const useSellerDashboard = () => {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, []);

  return data;
};