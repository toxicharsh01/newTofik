// import axios from "axios";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useParams } from "react-router-dom";
// import TodayDashboard from "./TodayDashboard";
// import { handleError, handleSuccess } from "../Tostify";
// import { ToastContainer } from "react-toastify";


// function CreateOrder({ customer, setCustomer }) {
//   const navigate = useNavigate();
//   const { register, handleSubmit, reset } = useForm();

//   const addOrder = async (data) => {
//     const api = `http://localhost:8080/tofik/orders/${customer._id}`;
//     await axios
//       .post(api, data)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         const { data } = err.response;
//         console.log(data.message);
//         handleError(data.message);
//         navigate("/orders");
//         setCustomer([]);
//       });
//       reset() 
//     navigate("/orders");
//   };

//   return (
//     <>
//   <div className="w-full flex flex-col sm:flex-row gap-5 sm:gap-10 p-4">

//   {/* LEFT SIDE: ORDER FORM CARD */}
//   {/* <div className="w-full sm:w-[32%] bg-gray-100 flex justify-center items-start py-8 px-4 rounded-md">
    
//     <div className="w-full bg-white shadow-md rounded-lg p-6">
      
//       <h1 className="text-xl sm:text-2xl font-bold text-indigo-700 text-center mb-1">
//         Add Order For
//       </h1>
//       <h3 className="text-lg font-semibold text-gray-700 text-center mb-6">
//         {customer?.name || "_____?_____"}
//       </h3>

//       <form onSubmit={handleSubmit(addOrder)} className="space-y-5">
        
//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Mint Quantity
//           </label>
//           <input
//             {...register("items.0.packs", { valueAsNumber: true })}
//             type="number"
//             min="0"
//             placeholder="Enter Mint quantity"
//             className="w-full border border-gray-300 rounded-md p-2 
//                    focus:ring-2 focus:ring-indigo-500 focus:outline-none 
//                    placeholder-gray-400 text-gray-700"
//           />
//         </div>

//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Normal Quantity
//           </label>
//           <input
//             {...register("items.1.packs", { valueAsNumber: true })}
//             type="number"
//             min="0"
//             placeholder="Enter Normal quantity"
//             className="w-full border border-gray-300 rounded-md p-2 
//                    focus:ring-2 focus:ring-indigo-500 focus:outline-none 
//                    placeholder-gray-400 text-gray-700"
//           />
//         </div>

//         <div className="flex justify-center mt-4">
//           <button
//             type="submit"
//             className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-medium 
//                    rounded-md hover:bg-indigo-700 transition-colors duration-200"
//           >
//             Submit Order
//           </button>
//         </div>
//       </form>

//     </div>
//   </div> */}

//   {/* TOAST */}
//   <ToastContainer className="mt-8 mr-3" position="top-left" />

// </div>

// {/* COUNT ORDER SECTION BELOW FORM */}
// <div className="w-full px-4 bg-blue-100 sm:px-8 mt-4">
//   <CountOrder />
// </div>

//       </>
//   );
// }

// export default CreateOrder;

// // import React from "react";
// // import { useForm } from "react-hook-form";
// // import axios from "axios";

// // function CreateOrder({ customer, setCustomer, onOrderAdded }) {
// //   const { register, handleSubmit, reset } = useForm();

// //   const addOrder = async (data) => {
// //     try {
// //       await axios.post(`http://localhost:8080/tofik/orders/${customer._id}`, data);
// //       reset();
// //       setCustomer(null);
// //       if (onOrderAdded) onOrderAdded(); // update dashboard instantly
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   return (
// //     <div className="w-full bg-white shadow-md rounded-lg p-6 mt-4">
// //       <h1 className="text-2xl font-bold text-indigo-700 text-center mb-2">
// //         Add Order For
// //       </h1>
// //       <h3 className="text-lg font-semibold text-gray-700 text-center mb-6">
// //         {customer?.name || "_____?_____"}
// //       </h3>

// //       <form onSubmit={handleSubmit(addOrder)} className="space-y-5">
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700">Mint Quantity</label>
// //           <input
// //             {...register("items.0.packs", { valueAsNumber: true })}
// //             type="number"
// //             min="0"
// //             placeholder="Enter Mint quantity"
// //             className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
// //           />
// //         </div>

// //         <div>
// //           <label className="block text-sm font-medium text-gray-700">Normal Quantity</label>
// //           <input
// //             {...register("items.1.packs", { valueAsNumber: true })}
// //             type="number"
// //             min="0"
// //             placeholder="Enter Normal quantity"
// //             className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
// //           />
// //         </div>

// //         <button
// //           type="submit"
// //           className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
// //         >
// //           Submit Order
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default CreateOrder;
