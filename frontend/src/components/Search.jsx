import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import CountOrder from "../components/Orders/CountOrder";

const Search = () => {
  const [query, setQuery] = useState("");
  const [searches, setSearches] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [counts, setCounts] = useState(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [customers, setCustomers] = useState([]);
  const api = "http://172.20.10.3:8080/tofik/customers";

  const getCustomers = async () => {
    try {
      const res = await axios.get(api); // all customers
      const allCustomers = res.data.data;

      const ordersRes = await axios.get("http://172.20.10.3:8080/tofik/orders");
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

  const { register, handleSubmit, reset, setValue, setFocus } = useForm({
    defaultValues: {
      items: [
        { packs: 0 }, // Mint
        { packs: 0 }, // Noraml
      ],
    },
  });
  const searchRef = useRef(null);

  const addOrder = async (data, selectedCustomer) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer!");
      return;
    }

    // if (
    //   (data.items?.[0]?.packs || 0) <= 0 &&
    //   (data.items?.[1]?.packs || 0) <= 0
    // ) {
    //   toast.error("Please enter at least one quantity!");
    //   return;
    // }

    const api = `http://172.20.10.3:8080/tofik/orders/${selectedCustomer._id}`;

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
        `http://172.20.10.3:8080/tofik/search-customers?q=${query}`,
      );
      setSearches(data.customersList || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCounts = async () => {
    setLoadingCounts(true);
    try {
      const res = await axios.get("http://172.20.10.3:8080/tofik/orders/count");
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

  const handleClick = async (id) => {
    try {
      const { data } = await axios.get(
        `http://172.20.10.3:8080/tofik/customers/${id}`,
      );
      setCustomer(data.data);
      setQuery("");
      setSearches([]);
      setActiveIndex(-1);

      // Reset quantities
      setValue("items.0.packs", null);
      setValue("items.1.packs", null);

      // Focus Mint input
      setFocus("items.0.packs");
    } catch (err) {
      console.error(err);
    }
  };

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

        {searches?.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 max-h-[40vh] overflow-y-auto bg-white shadow-lg border rounded-md mt-1">
            {searches.map((item, index) => (
              <div
                key={item._id}
                onClick={() => setSelectedCustomer(item)}
                className={`px-3 py-2 flex justify-between cursor-pointer border-b hover:bg-indigo-100 ${
                  activeIndex === index ? "bg-indigo-200" : ""
                }`}
              >
                <span className="text-sm">{item.name}</span>
                <span className="text-xs text-gray-500">{item.phone}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CUSTOMER LIST */}
      <div className="w-full max-w-[360px] mt-3 space-y-2">
        {[...customers]
          .sort((a, b) => a.name.localeCompare(b.name)) // A → Z
          .map((c) => (
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
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
              onSubmit={handleSubmit((data) =>
                addOrder(data, selectedCustomer),
              )}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <label className="text-xs sm:text-sm font-medium text-gray-600">
                Mint
              </label>
              <input
                {...register("items.0.packs", { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="Mint"
                className="flex-1 border border-gray-300 rounded-md p-2 text-sm text-center focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <label className="text-xs sm:text-sm font-medium text-gray-600">
                Normal
              </label>
              <input
                {...register("items.1.packs", { valueAsNumber: true })}
                type="number"
                min="0"
                placeholder="Normal"
                className="flex-1 border border-gray-300 rounded-md p-2 text-sm text-center focus:ring-1 focus:ring-indigo-500 outline-none"
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

      <ToastContainer position="top-left" />
    </div>
  );
};

export default Search;
