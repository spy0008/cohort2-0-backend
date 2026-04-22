import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchProduct,
  setSelectedImage,
  setSelectedVariant,
} from "../state/SingleProductSlice";

export const useSingleProduct = (id) => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.singleProduct);

  useEffect(() => {
    if (id) dispatch(fetchProduct(id));
  }, [id]);

  return {
    ...state,
    setSelectedImage: (img) => dispatch(setSelectedImage(img)),
    setSelectedVariant: (v) => dispatch(setSelectedVariant(v)),
  };
};
