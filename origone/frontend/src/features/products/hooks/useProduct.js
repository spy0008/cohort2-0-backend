import {
  createProduct,
  getAllProduct,
  getSellerProduct,
} from "../service/product.api";
import { useDispatch } from "react-redux";
import { setProducts, setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateProduct(formData) {
    const data = await createProduct(formData);
    return data.product;
  }

  async function handleGetSellerProduct() {
    const data = await getSellerProduct();
    dispatch(setSellerProducts(data.products));
    return data.products;
  }

  async function handleGetAllProducts() {
    const data = await getAllProduct();
    dispatch(setProducts(data.products));
  }

  return { handleCreateProduct, handleGetSellerProduct, handleGetAllProducts };
};
