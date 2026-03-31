
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";

function Customer() {
  // const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const api = "https://newtofik001.onrender.com/tofik/customers";

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
    <div className="max-w-7xl mx-auto p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-3">
        <h1 className="text-2xl md:text-3xl text-gray-800 font-semibold">
          All Customers
        </h1>
        <NavLink
          to="/add-customer"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm transition"
        >
          + Add Customer
        </NavLink>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:grid bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
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
      <div className="md:hidden p-2 space-y-2">
        {customers.map((customer) => (
          <NavLink
            key={customer._id}
            to={`/customer/${customer._id}`}
            className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <span className="font-semibold text-gray-900">{customer.name}</span>
            <span
              
            >
              {customer.phone}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Customer;
