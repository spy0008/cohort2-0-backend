import { useDispatch } from "react-redux";
import { fetchDashboard } from "../../state/dashboardSlice";
import { updateOrderStatusApi } from "../../service/dashboard.api";
import { useState } from "react";
import { STATUS_FLOW } from "../../../../../shared/utils/orderStatusFlow";
import toast from "react-hot-toast";

const OrderDetailsModal = ({ order, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const allowedNext = STATUS_FLOW[order.status] || [];

  const handleUpdate = async (newStatus) => {
    try {
      setLoading(true);
      await updateOrderStatusApi(order._id, newStatus);
      toast.success("Status updated 🚀");
      dispatch(fetchDashboard());
      onClose();
    } catch (err) {
      toast.error("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-600";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-600";
      case "shipped":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-8 space-y-6">

        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Invoice
            </h1>
            <p className="text-xs text-gray-500">
              Order ID: #{order._id.slice(-6)}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">

          <div className="space-y-1">
            <p className="font-medium text-gray-700">Billed To</p>
            <p>{order.user?.fullname || "Customer"}</p>
            <p className="text-gray-500">{order.user?.email || "-"}</p>
            <p className="text-gray-500">{order.user?.contact || "-"}</p>

            <div className="pt-2">
              <p>{order.address?.fullAddress || "-"}</p>
              <p>
                {order.address?.city || "-"} - {order.address?.pincode || "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">

            <span className="text-xs uppercase text-gray-400">
              Order Status
            </span>

            <span
              className={`px-3 py-1 text-xs rounded-full ${statusColor(
                order.status
              )}`}
            >
              {order.status || "pending"}
            </span>

            <span className="text-xs uppercase text-gray-400 mt-2">
              Payment
            </span>

            <span
              className={`px-3 py-1 text-xs rounded-full ${statusColor(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus || "pending"}
            </span>

            <span className="text-xs text-gray-400">
              Method: {order.paymentMethod || "cod"}
            </span>

            <div className="flex gap-2 mt-3 flex-wrap justify-end">
              {allowedNext.map((status) => (
                <button
                  key={status}
                  disabled={loading}
                  onClick={() => handleUpdate(status)}
                  className="text-xs cursor-pointer px-3 py-1 rounded bg-orange-500 text-white hover:bg-orange-600"
                >
                  Mark {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs">
              <tr>
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Variant</th>
                <th className="text-center p-3">Qty</th>
                <th className="text-right p-3">Price</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      className="w-12 h-12 rounded object-cover border"
                    />
                    <span className="font-medium">{item.title}</span>
                  </td>

                  <td className="p-3 text-gray-500">
                    {item.size} • {item.color}
                  </td>

                  <td className="p-3 text-center">{item.quantity}</td>

                  <td className="p-3 text-right font-medium">
                    ₹{item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full border-t pt-4 space-y-2 text-sm">

          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₹{order.totalAmount}</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            <span>₹0</span>
          </div>

          <div className="flex justify-between text-lg font-semibold border-t pt-3">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center border-t pt-4">
          Internal Order Invoice • For Seller Use
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;