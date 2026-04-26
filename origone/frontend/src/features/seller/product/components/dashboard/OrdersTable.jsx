import { useDispatch } from "react-redux";
import { fetchDashboard } from "../../state/dashboardSlice";
import { updateOrderStatusApi } from "../../service/dashboard.api";
import { useState } from "react";
import { STATUS_FLOW } from "../../../../../shared/utils/orderStatusFlow";
import toast from "react-hot-toast";
import OrderDetailsModal from "./OrderDetailsModal";
import { ChevronDown } from "lucide-react";

const OrdersTable = ({ orders }) => {
  const dispatch = useDispatch();
  const [loadingId, setLoadingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

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

      toast.success("Order updated 🚀");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoadingId(null);
      setOpenDropdown(null);
    }
  };

  const getStatusColor = (status) => {
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-xl tracking-tight">
          Recent Orders
        </h2>

        {orders.length === 0 && (
          <span className="text-xs text-gray-400">Demo preview</span>
        )}
      </div>

      <div className="space-y-4">
        {displayOrders.map((order) => {
          const currentStatus = order.status;
          const allowedNext = STATUS_FLOW[currentStatus] || [];

          return (
            <div
              key={order._id}
              className="border rounded-2xl p-5 space-y-4 cursor-pointer 
              hover:shadow-xl hover:border-black/10 transition-all"
              onClick={() => {
                if (loadingId) return;
                setSelectedOrder(order);
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-semibold">
                    #{order._id.slice(-6)}
                  </p>
                </div>

                <div
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === order._id ? null : order._id
                      )
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition ${getStatusColor(
                      currentStatus
                    )}`}
                  >
                    {currentStatus}
                    <ChevronDown size={14} />
                  </button>

                  {openDropdown === order._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-20 overflow-hidden animate-fadeIn">
                      {allowedNext.length === 0 ? (
                        <p className="text-xs text-gray-400 p-3 text-center">
                          No actions
                        </p>
                      ) : (
                        allowedNext.map((status) => (
                          <button
                            key={status}
                            disabled={loadingId === order._id}
                            onClick={() =>
                              handleStatusUpdate(order._id, status)
                            }
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition"
                          >
                            Mark {status}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <img
                    src={item.image}
                    className="w-14 h-14 rounded-lg border object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      {item.size} • {item.color}
                    </p>
                  </div>

                  <div className="text-sm text-right">
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                    <p className="font-semibold">₹{item.price}</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                <span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm font-semibold text-black">
                  ₹{order.totalAmount}
                </span>
              </div>

              {loadingId === order._id && (
                <p className="text-xs text-orange-500">Updating...</p>
              )}
            </div>
          );
        })}
      </div>

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