import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddCustomer() {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Capitalize each word in name
  const capitalizeName = (value) => {
    return value
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("http://172.20.10.3:8080/tofik/customers", data);
      toast.success("Customer added successfully!");
      reset();
      setTimeout(() => navigate("/customers"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add customer!");
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Add Customer
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter customer name"
            onChange={(e) => {
              const formatted = capitalizeName(e.target.value);
              setValue("name", formatted);
            }}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            inputMode="numeric"
            {...register("phone", {
              required: "Phone number required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit phone number"
              }
            })}
            className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
          <textarea
            {...register("address")}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter address"
          ></textarea>
        </div>

        {/* Fixed Rates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Grams per Pack</label>
            <input
              type="text"
              inputMode="numeric"
              {...register("fixedRates[0].gramsPerPack", {
                required: "Grams per pack required",
                pattern: { value: /^[0-9]+$/, message: "Enter a valid number" }
              })}
              className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.fixedRates?.[0]?.gramsPerPack ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g. 50"
            />
            {errors.fixedRates?.[0]?.gramsPerPack && (
              <p className="text-red-500 text-xs mt-1">{errors.fixedRates[0].gramsPerPack.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rate per Pack</label>
            <input
              type="text"
              inputMode="numeric"
              {...register("fixedRates[0].ratePerPack", {
                required: "Rate per pack required",
                pattern: { value: /^[0-9]+$/, message: "Enter a valid number" }
              })}
              className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.fixedRates?.[0]?.ratePerPack ? "border-red-500" : "border-gray-300"}`}
              placeholder="e.g. 10"
            />
            {errors.fixedRates?.[0]?.ratePerPack && (
              <p className="text-red-500 text-xs mt-1">{errors.fixedRates[0].ratePerPack.message}</p>
            )}
          </div>
        </div>

        
        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Submit
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}

export default AddCustomer;
