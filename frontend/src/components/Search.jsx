import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import CountOrder from "../components/Orders/CountOrder";
import { NavLink } from "react-router-dom";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = import.meta.env.VITE_LOCAL_API;

const Search = () => {
  const [query, setQuery] = useState("");
  const [searches, setSearches] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [counts, setCounts] = useState(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [loadingCustomers, setloadingCustomers] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [customers, setCustomers] = useState([]);
  const api = `${BASE_URL}/tofik/customers`;

  const getCustomers = async () => {
    try {
      const res = await axios.get(api); // all customers
      const allCustomers = res.data.data;
      const ordersRes = await axios.get(`${BASE_URL}/tofik/orders`);
      const allOrders = ordersRes.data.data;

      // Filter customers who do NOT have an order
      const availableCustomers = allCustomers.filter(
        (c) =>
          !allOrders.some((o) => o.customerId._id === c._id && o.isOrdered),
      );

      setCustomers(availableCustomers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const { register, handleSubmit, reset, setValue, setFocus } = useForm({});
  const searchRef = useRef(null);

  const addOrder = async (data, selectedCustomer) => {
  if (!selectedCustomer) {
    toast.error("Please select a customer!");
    return;
  }

  // ✅ Ensure packs are numbers, empty or invalid => 0
  if (data.items && Array.isArray(data.items)) {
    data.items = data.items.map((item) => ({
      ...item,
      packs: Number(item.packs) || 0, // NaN, undefined, empty string -> 0
    }));
  }

  // Optional: check if all packs are 0
  if (data.items.every((item) => item.packs <= 0)) {
    toast.error("Please enter at least one quantity!");
    return;
  }

  const api = `${BASE_URL}/tofik/orders/${selectedCustomer._id}`;

  try {
    const res = await axios.post(api, data);

    if (res.data.success === false) {
      toast.error(res.data.message || "Order already exists!");
      return;
    }

    toast.success("Order created successfully!");

    // ✅ hide customer from list (today)
    setCustomers((prev) =>
      prev.filter((c) => c._id !== selectedCustomer._id),
    );

    // ✅ reset form + close popup
    reset();
    setSelectedCustomer(null);

    // optional
    fetchCounts();
  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.message ||
        "Something went wrong while adding order!",
    );

    setSelectedCustomer(null);
  }
};
  // Fetch customers
  const GetSearches = async () => {
    if (!query) return;
    try {
      const { data } = await axios.get(
        `${BASE_URL}/tofik/search-customers?q=${query}`,
      );
      setSearches(data.customersList || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCounts = async () => {
    setLoadingCounts(true);
    try {
      const res = await axios.get(`${BASE_URL}/tofik/orders/count`);
      setCounts(res.data.totalsByGrams);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    GetSearches();
  }, [query]);

  useEffect(() => {
    fetchCounts();
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearches([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-3 bg-gray-50">
      {/* SEARCH */}
      <div ref={searchRef} className="w-full max-w-[360px] mt-3 relative">
        <input
          type="text"
          value={query}
          placeholder="Search customer..."
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value) {
              setSearches([]);
              setActiveIndex(-1);
            }
          }}
        />

        {query.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 max-h-[40vh] overflow-y-auto mt-1 space-y-1 bg-gray-50 border border-gray-200 rounded-lg shadow-md p-1">
            {loadingCustomers ? (
              <div className="text-center text-gray-600 py-2 text-sm bg-gray-100 rounded-md">
                Loading customers...
              </div>
            ) : searches?.length > 0 ? (
              searches.map((item, index) => (
                <div
                  key={item._id}
                    onClick={() => {
    setSelectedCustomer(item); // popup
    setQuery(""); // ✅ search clear
    setSearches([]); // ✅ dropdown close
    setActiveIndex(-1); // (optional)
  }}
                  className="flex justify-between items-center bg-white px-3 py-2 rounded-md shadow-sm cursor-pointer hover:bg-indigo-50 transition"
                >
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomer(item); // popup
                      setQuery(""); // ✅ search box clear
                      setSearches([]); // ✅ dropdown close
                      setActiveIndex(-1); // (optional reset)
                      window.location.href = `tel:${item.phone}`; // call
                    }}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
                  >
                    {item.phone}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-2 text-sm bg-gray-100 rounded-md">
                No customers found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-[360px] flex justify-center mt-2">
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `px-3 py-1 text-xs sm:text-sm rounded font-medium transition-colors duration-150 ${
              isActive
                ? "bg-indigo-600 text-white"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`
          }
        >
          Reports
        </NavLink>
      </div>

      {/* CUSTOMER LIST */}
      <div className="w-full max-w-[360px] mt-3 space-y-2 h-90 overflow-y-auto">
        {[...customers].map((c) => (
          <div
            key={c._id}
            onClick={() => setSelectedCustomer(c)} // click on name opens popup
            className="flex justify-between items-center bg-white border rounded-lg px-3 py-2 shadow-sm active:scale-[0.98] transition cursor-pointer"
          >
            <span className="text-sm font-medium">{c.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent row click double-trigger
                setSelectedCustomer(c); // open order popup
                window.location.href = `tel:${c.phone}`; // trigger phone call
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              {c.phone}
            </button>
          </div>
        ))}
      </div>
      {/* POPUP */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 px-3 pt-20 sm:pt-32 overflow-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 animate-slideIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-700 truncate">
                {selectedCustomer.name}
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 transition text-xl"
              >
                ✖
              </button>
            </div>

            {/* Form */}
            <form
  onSubmit={handleSubmit((data) => addOrder(data, selectedCustomer))}
  className="flex flex-col sm:flex-row sm:items-center gap-3"
>
  <label className="text-xs sm:text-sm font-medium text-gray-600">
    Thandai
  </label>
  <input
    {...register("items.0.packs", { valueAsNumber: true })}
    type="number"
    placeholder="Enter Quantity"
    className="flex-1 border border-gray-300 rounded-md p-2 text-sm text-center focus:ring-1 focus:ring-indigo-500 outline-none"
    defaultValue="" // input empty initially
  />

  <label className="text-xs sm:text-sm font-medium text-gray-600">
    Sada
  </label>
  <input
    {...register("items.1.packs", { valueAsNumber: true })}
    type="number"
    placeholder="Enter Quantity"
    className="flex-1 border border-gray-300 rounded-md p-2 text-sm text-center focus:ring-1 focus:ring-indigo-500 outline-none"
    defaultValue="" // input empty initially
  />

  <button
    type="submit"
    className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition text-sm font-medium"
  >
    Add Order
  </button>
</form>
          </div>
        </div>
      )}

      {/* COUNT */}
      {!loadingCounts && counts && Object.keys(counts).length > 0 && (
        <div className="w-full flex justify-center mt-6">
          <CountOrder />
        </div>
      )}

      <ToastContainer position="top-left" autoClose={700} />
    </div>
  );
};

export default Search;
