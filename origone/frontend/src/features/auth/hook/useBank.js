import { useDispatch } from "react-redux";
import { updateBankThunk } from "../state/auth.slice";

export const useBank = () => {
  const dispatch = useDispatch();

  const updateBank = (data) => {
    return dispatch(updateBankThunk(data)).unwrap();
  };

  return { updateBank };
};