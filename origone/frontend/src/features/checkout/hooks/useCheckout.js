import { useDispatch, useSelector } from "react-redux";
import { createPayment, verifyPayment } from "../state/checkout.slice";
import toast from "react-hot-toast";
import { getOrderByIdApi } from "../services/checkout.api";

export const useCheckout = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.checkout);

  const handlePayment = async (address) => {
    if (loading) return;

    try {
      const res = await dispatch(createPayment()).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: res.amount,
        currency: "INR",
        order_id: res.orderId,

        handler: async function (response) {
          try {
            const verifyRes = await dispatch(
              verifyPayment({
                ...response,
                address,
              }),
            ).unwrap();

            const orderId = verifyRes.order._id;

            window.location.href = `/order-success/${orderId}`;
          } catch (err) {
            toast.error(err?.message || "Verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err?.message || "Payment failed");
    }
  };

  const orderSuccess = async (id) => {
    try {
      const res = await getOrderByIdApi(id);

      return res.data;
    } catch (error) {
      toast.error(error?.message || "Order fatch failed");
    }
  };

  return { handlePayment, loading, orderSuccess };
};
