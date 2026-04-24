import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../state/order.slice";
import { useEffect } from "react";

export const useOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return { orders, loading };
};