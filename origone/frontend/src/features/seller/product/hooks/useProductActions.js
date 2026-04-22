import { useDispatch } from "react-redux";
import {
  deleteProductThunk,
  updateProductThunk,
  fetchSellerProducts,
} from "../state/productSlice";

export const useProductActions = () => {
  const dispatch = useDispatch();

  const deleteProduct = async (id) => {
    await dispatch(deleteProductThunk(id));
    dispatch(fetchSellerProducts());
  };

  const updateProduct = (data) => {
    dispatch(updateProductThunk(data));
  };

  return { deleteProduct, updateProduct };
};
