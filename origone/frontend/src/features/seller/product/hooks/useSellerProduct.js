import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "../state/productSlice";
import { useEffect } from "react";

export const useSellerProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((s) => s.product.list);

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  return { products, loading };
};
