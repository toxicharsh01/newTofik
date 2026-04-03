import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_LOCAL_API;

function Reports() {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async (selectedDate, searchText) => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/tofik/orders/reports?q=${selectedDate}&name=${searchText}`
      );
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchReports(date, search);
    }, 400);

    return () => clearTimeout(delay);
  }, [date, search]);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      
      {/* 🔥 Sticky Filters */}
      <div className="max-w-md mx-auto mb-4 sticky top-0 z-10 bg-gray-50 pb-2">
        <div className="flex flex-wrap items-center justify-between bg-white shadow-md rounded-xl px-4 py-3 gap-2">
          
          {/* Date */}
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700">
              Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full sm:w-auto"
          />

          {/* Count */}
          <div className="flex items-center justify-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold text-sm w-full sm:w-auto">
            <span>Total:</span>
            <span className="font-bold">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* 🔥 Scrollable Orders */}
      <div className="max-w-3xl mx-auto max-h-[75vh] overflow-y-auto pr-2">
        
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">
            No orders found.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const totalPacks = order.items.reduce(
                (acc, item) => acc + item.packs,
                0
              );

              const totalAmount = order.items.reduce(
                (acc, item) => acc + item.totalAmount,
                0
              );

              return (
                <div
                  key={order._id}
                  className="bg-white border rounded-lg shadow-sm p-2"
                >
                  {/* Customer */}
                  <h2 className="text-center text-indigo-700 font-bold underline text-md mb-1 truncate">
                    {order.customerId?.name || "Unknown Customer"}
                  </h2>

                  {/* Table */}
                  <div className="grid grid-cols-3 gap-1 bg-gray-50 rounded p-1 text-sm">
                    
                    {/* Header */}
                    <div className="font-medium text-gray-600 text-center">
                      Product
                    </div>
                    <div className="font-medium text-gray-600 text-center">
                      Packs
                    </div>
                    <div className="font-medium text-gray-600 text-center">
                      Amount
                    </div>

                    {/* Items */}
                    {order.items.map((item) => (
                      <React.Fragment key={item.productId._id}>
                        <div className="text-center">
                          {item.productId?.name}
                        </div>
                        <div className="text-center">{item.packs}</div>
                        <div className="text-center">
                          ₹{item.totalAmount}
                        </div>
                      </React.Fragment>
                    ))}

                    {/* Divider */}
                    <div className="col-span-3 border-t border-gray-300 my-1"></div>

                    {/* Totals */}
                    <div className="text-center font-semibold text-indigo-700 bg-indigo-50 rounded">
                      Total
                    </div>
                    <div className="text-center font-semibold text-indigo-700 bg-indigo-50 rounded">
                      {totalPacks}
                    </div>
                    <div className="text-center font-semibold text-indigo-700 bg-indigo-50 rounded">
                      ₹{totalAmount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;