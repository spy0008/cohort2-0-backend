import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../state/order.slice";
import { useEffect } from "react";

export const useOrderDetail = (id) => {
  const dispatch = useDispatch();
  const { selectedOrder, loading } = useSelector((s) => s.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  return { order: selectedOrder, loading };
};