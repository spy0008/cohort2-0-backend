import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setFilters, setPage } from "../state/shopSlice";
import { useEffect } from "react";

export const useShop = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.shop);

  useEffect(() => {
    dispatch(fetchProducts({ ...state.filters, page: state.page }));
  }, [state.filters, state.page]);

  return {
    ...state,
    setFilters: (data) => dispatch(setFilters(data)),
    setPage: (p) => dispatch(setPage(p)),
  };
};