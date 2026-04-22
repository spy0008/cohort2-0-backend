import { useDispatch } from "react-redux";
import { fetchDashboard } from "../../state/dashboardSlice";
import { updateOrderStatusApi } from "../../service/dashboard.api";
import { useState } from "react";
import { STATUS_FLOW } from "../../../../../shared/utils/orderStatusFlow";
import toast from "react-hot-toast";
import OrderDetailsModal from "./OrderDetailsModal";

const OrdersTable = ({ orders }) => {
  const dispatch = useDispatch();
  const [loadingId, setLoadingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dummyOrders = [
    {
      _id: "ORD123456",
      status: "pending",
      totalAmount: 1299,
      paymentStatus: "pending",
      paymentMethod: "cod",
      createdAt: new Date(),
      address: {
        fullAddress: "221B Baker Street",
        city: "London",
        pincode: "123456",
      },
      user: {
        fullname: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },
      items: [
        {
          title: "Classic White T-Shirt",
          image: "https://via.placeholder.com/50",
          size: "M",
          color: "White",
          quantity: 1,
          price: 1299,
        },
      ],
    },
  ];

  const displayOrders = orders.length === 0 ? dummyOrders : orders;

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoadingId(orderId);

      const isDummy = dummyOrders.some((o) => o._id === orderId);

      if (!isDummy) {
        await updateOrderStatusApi(orderId, newStatus);
        dispatch(fetchDashboard());
      }

      toast.success("Order status updated 🚀");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold text-lg">Recent Orders</h2>

        {orders.length === 0 && (
          <span className="text-xs text-gray-400">Showing demo preview</span>
        )}
      </div>

      <div className="space-y-4">
        {displayOrders.map((order) => {
          const currentStatus = order.status;
          const allowedNext = STATUS_FLOW[currentStatus] || [];

          return (
            <div
              key={order._id}
              onClick={() => {
                if (loadingId) return;
                setSelectedOrder(order);
              }}
              className="border rounded-xl p-4 space-y-3 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Order #{order._id.slice(-6)}
                </span>

                <select
                  value={currentStatus}
                  disabled={loadingId === order._id}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleStatusUpdate(order._id, e.target.value)
                  }
                  className="text-xs border cursor-pointer rounded px-2 py-1"
                >
                  <option value={currentStatus}>{currentStatus}</option>

                  {allowedNext.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <img
                    src={item.image}
                    className="w-12 h-12 rounded border object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      {item.size} • {item.color}
                    </p>
                  </div>

                  <div className="text-sm text-right">
                    <p>quantity: {item.quantity}</p>
                    <p className="font-medium">₹{item.price}</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="font-medium">₹{order.totalAmount}</span>
              </div>

              {loadingId === order._id && (
                <p className="text-xs text-orange-500">Updating...</p>
              )}
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <p className="text-center text-gray-400 mt-4 text-sm">
          No real orders yet — this is a preview
        </p>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersTable;
