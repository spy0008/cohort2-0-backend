import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWallet,
  fetchTransactions,
  withdrawThunk,
} from "../state/wallet.slice";

export const useWallet = () => {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.wallet);

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(fetchTransactions());
  }, []);

  const withdraw = () => {
    dispatch(withdrawThunk()).then(() => {
      dispatch(fetchWallet());
      dispatch(fetchTransactions());
    });
  };

  return { ...data, withdraw };
};