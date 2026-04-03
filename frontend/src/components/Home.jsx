import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = import.meta.env.VITE_LOCAL_API;

function Home({ addOrder }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tofik/orders`);
      let data = res.data.data;
      // Sort so that isCompleted orders go last
      const notCompleted = data.filter((o) => !o.isCompleted);
      const completed = data.filter((o) => o.isCompleted);

      setOrders([...notCompleted, ...completed]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [addOrder]);

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/tofik/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("Order deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  const handleComplete = async (orderId) => {
    const confirmComplete = window.confirm(
      "Are you sure you want to mark this order as completed?",
    );
    if (!confirmComplete) return;

    try {
      // Update isCompleted on backend
      await axios.put(`${BASE_URL}/tofik/orders/${orderId}`, {
        isCompleted: true,
      });

      // Update local state immutably
      setOrders((prevOrders) => {
        // Separate completed and remaining orders
        const updatedOrders = prevOrders.map((order) =>
          order._id === orderId ? { ...order, isCompleted: true } : order,
        );

        // Move completed order(s) to the end
        const completed = updatedOrders.filter((o) => o.isCompleted);
        const notCompleted = updatedOrders.filter((o) => !o.isCompleted);

        return [...notCompleted, ...completed];
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark order as completed");
    }
  };
  return (
    <div className="p-4">
      <ToastContainer position="top-left" autoClose={500} />
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto max-h-[70vh]">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm sticky top-0 z-10">
              <div className="p-3">Customer</div>
              <div className="p-3">Packs</div>
              <div className="p-3 text-center">Rate</div>
              <div className="p-3 text-center">Action</div>
            </div>

            {/* Rows */}
            {orders.map((item, index) => {
              const totalPacks = item.items.reduce((t, x) => t + x.packs, 0);

              return (
                <div
                  key={item._id}
                  className={`grid grid-cols-4 text-sm transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  {/* Name */}
                  <div className="px-3 py-2 font-semibold text-gray-800">
                    {item.customerId.name}
                    <div
                      className={`text-xs font-bold ${
                        item.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.paymentStatus}
                    </div>
                  </div>

                  {/* Packs */}
                  <div className="px-3 py-2 text-xs space-y-1">
                    {item.items.map((x, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="font-medium">{x.productId.name}</span>
                        <span>{x.packs}</span>
                      </div>
                    ))}

                    <div className="flex justify-between border-t pt-1 mt-1 text-indigo-600 font-semibold">
                      <span>Total</span>
                      <span>{totalPacks}</span>
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="px-3 py-2 flex items-center justify-center font-semibold text-gray-700">
                    ₹{item.items[0]?.ratePerPack || 0}
                  </div>

                  {/* Delete */}
                  <div className="px-3 py-2 flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-3 p-3 max-h-[70vh] overflow-y-auto">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 font-semibold py-10">
              No Order Today
            </div>
          ) : (
            orders.map((item) => {
              const totalPacks = item.items.reduce(
                (sum, x) => sum + x.packs,
                0,
              );

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md border p-3 space-y-2"
                >
                  {/* Top */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-semibold text-blue-700 ${
                        item.isCompleted ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {item.customerId.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold px-2 py-1 border border-red-600 rounded-md transition"
                      >
                        Delete
                      </button>

                      {!item.isCompleted && (
                        <button
                          onClick={() => handleComplete(item._id)}
                          className="text-green-600 hover:text-green-800 text-sm font-semibold px-2 py-1 border border-green-600 rounded-md transition"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Packs */}
                  <div className="text-sm space-y-1">
                    {item.items.map((x) => (
                      <div
                        key={x.productId._id}
                        className="flex justify-between text-gray-800"
                      >
                        <span className="font-semibold text-base">
                          {x.productId.name}
                        </span>
                        <span className="font-semibold text-base">
                          {x.packs}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom */}
                  <div className="flex justify-between items-center border-t pt-2 mt-2">
                    <span className="text-indigo-900 font-semibold text-sm">
                      Amount : ₹{totalPacks * (item.items[0]?.ratePerPack || 0)}
                    </span>

                    <div className="flex gap-2 items-center">
                      <span className="text-gray-800 font-semibold text-sm">
                        {totalPacks}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
