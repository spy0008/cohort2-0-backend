import { useDispatch, useSelector } from "react-redux";
import {
  createProductThunk,
  resetCreateState,
  resetUpdateState,
} from "../state/productSlice";

export const useCreateProduct = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.product.create,
  );

  const createProduct = (formData) => {
    dispatch(createProductThunk(formData));
  };

  const reset = () => {
    dispatch(resetCreateState());
    dispatch(resetUpdateState());
  };

  return {
    createProduct,
    loading,
    success,
    error,
    reset,
  };
};
