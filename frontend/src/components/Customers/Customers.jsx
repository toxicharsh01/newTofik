import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_LOCAL_API;

function Customer() {
  const [customers, setCustomers] = useState([]);
    const [searches, setSearches] = useState([]);
   const [query, setQuery] = useState("");
  
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

    useEffect(() => {
      GetSearches();
    }, [query]);

  const api = `${BASE_URL}/tofik/customers`;

  const getCustomers = async () => {
    try {
      const res = await axios.get(api);
      setCustomers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 h-screen flex flex-col overflow-hidden">

  {/* Header */}
  <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-3 flex-shrink-0">
    <h1 className="text-2xl md:text-3xl text-gray-800 font-semibold">
      All Customers{" "}
      <span className="text-xl text-gray-500 font-semibold">
        [{customers.length}]
      </span>
    </h1>

    <NavLink
      to="/add-customer"
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm transition"
    >
      + Add Customer
    </NavLink>
  </div>

  {/* 🔍 Search Input */}
  <div className="w-full max-w-[360px] mb-3 relative flex-shrink-0">
    <input
      type="text"
      value={query}
      placeholder="Search customer..."
      className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      onChange={(e) => setQuery(e.target.value)}
    />

    {/* Dropdown Results */}
    {query && searches.length > 0 && (
      <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
        {searches.map((customer) => (
          <NavLink
            key={customer._id}
            to={`/customer/${customer._id}`}
            onClick={() => {
              setQuery("");
              setSearches([]);
            }}
            className="flex justify-between items-center px-3 py-3 hover:bg-indigo-100 cursor-pointer"
          >
            <span className="font-semibold text-gray-800 text-base">
              {customer.name}
            </span>
            <span className="text-sm text-gray-500">{customer.phone}</span>
          </NavLink>
        ))}
      </div>
    )}

    {query && searches.length === 0 && (
      <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 p-3 text-sm text-gray-500">
        No Customer Found
      </div>
    )}
  </div>

  {/* Desktop Table */}
  <div className="hidden md:grid bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex-shrink-0">
    <div className="grid grid-cols-7 bg-indigo-600 text-white font-semibold text-sm sticky top-0 z-10">
      <div className="p-3 text-left">Name</div>
      <div className="p-3 text-left">Phone</div>
      <div className="p-3 text-left">Address</div>
      <div className="p-3 text-center">Grams</div>
      <div className="p-3 text-center">Rate</div>
      <div className="p-3 text-center">Balance</div>
      <div className="p-3 text-center">Action</div>
    </div>

    {customers.map((item, index) => (
      <div
        key={item._id}
        className={`grid grid-cols-7 text-sm border-b border-gray-200 ${
          index % 2 === 0 ? "bg-gray-50" : "bg-white"
        } hover:bg-gray-100 transition`}
      >
        <div className="p-3 font-medium text-gray-900">{item.name}</div>
        <div className="p-3 text-gray-700">{item.phone}</div>
        <div className="p-3 text-gray-600">{item.address}</div>
        <div className="p-3 text-center font-semibold text-amber-700">
          {item.fixedRates[0]?.gramsPerPack}
        </div>
        <div className="p-3 text-center text-gray-700">
          {item.fixedRates[0]?.ratePerPack}
        </div>
        <div
          className={`p-3 text-center font-bold ${
            item.currentBalance === 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {item.currentBalance}
        </div>
        <div className="p-3 text-center">
          <NavLink
            to={`/customer/${item._id}`}
            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-xs"
          >
            ✏️
          </NavLink>
        </div>
      </div>
    ))}
  </div>

  {/* MOBILE LIST */}
  <div className="md:hidden p-2 space-y-2 flex-1 overflow-y-auto">
    {customers.map((customer) => (
      <NavLink
        key={customer._id}
        to={`/customer/${customer._id}`}
        className="flex justify-between items-center bg-white border rounded-lg px-3 py-2 shadow-sm active:scale-[0.98] transition cursor-pointer"
      >
        <span className="text-sm font-medium text-gray-800">{customer.name}</span>
        <span className="text-sm font-semibold text-indigo-700">{customer.phone}</span>
      </NavLink>
    ))}
  </div>
</div>
  );
}

export default Customer;
