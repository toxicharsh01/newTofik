import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditCustomer() {
  const [customer, setCustomer] = useState(null);
  const { id } = useParams();
  const api = `https://newtofik001.onrender.com/tofik/customers/${id}`;
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const getCustomer = async () => {
    try {
      const res = await axios.get(api);
      reset(res.data.data);
      setCustomer(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.put(api, data);
      navigate(-1);
      alert("Customer updated successfully!");
    } catch (error) {
      console.error("Error updating customer: ", error);
      alert("Something went wrong!");
    }
  };

  const deleteHandler = async () => {
    try {
      await axios.delete(api);
      navigate("/customers");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCustomer();
  }, [id, reset]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Edit Customer
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <input
            {...register("name")}
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter customer name"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Phone
          </label>
          <input
            {...register("phone")}
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter phone number"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Address
          </label>
          <textarea
            {...register("address")}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter address"
          ></textarea>
        </div>

        {/* Fixed Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Grams per Pack
            </label>
            <input
              {...register("fixedRates.0.gramsPerPack")}
              type="number"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. 50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Rate per Pack
            </label>
            <input
              {...register("fixedRates.0.ratePerPack")}
              type="number"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g. 10"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
          <NavLink
            to="/customers"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium text-center"
          >
            Cancel
          </NavLink>

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this customer?")
              ) {
                deleteHandler();
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
          >
            Delete
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Update Customer
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCustomer;
