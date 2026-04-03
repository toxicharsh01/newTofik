import React from "react";

import Search from "../Search";
import { Outlet } from "react-router-dom";

function Order() {
  return (
    <>
      <div className=" w-[50h-screen">
        <Outlet/>
        <Search />
      </div>

    </>
  );
}

export default Order;


// import React, { useState, useEffect } from "react";

// import axios from "axios";
// import TodayDashboard from "./TodayDashboard";
// import Search from "../Search";


// function Order() {
//    const [customer, setCustomer] = useState(null);
//   const [orders, setOrders] = useState([]);

  
//   const fetchOrders = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:8080/tofik/orders");
//       setOrders(data.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };  

//    useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className="flex w-full min-h-screen bg-gray-100">
//       {/* Left: Search + Create */}
//       <div className="w-full md:w-1/2 p-4 flex justify-center">
//         <Search 
//           customer={customer} 
//           setCustomer={setCustomer} 
//           onOrderAdded={fetchOrders} .
//         />
//       </div>

//       {/* Right: Dashboard */}
//       <div className="w-full md:w-1/2 p-4 flex justify-center">
//         <TodayDashboard orders={orders} />
//       </div>
//     </div>
//   );
// }

// export default Order;
