import React from "react";
import { NavLink } from "react-router-dom";
import Search from "./Search";

function Nav() {
  
 return (
    <div className="w-full bg-gray-100 shadow flex justify-center items-center h-12 gap-6">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `px-3 py-1 rounded font-medium transition-colors duration-150 ${
            isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"
          }`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/orders"
        end
        className={({ isActive }) =>
          `px-3 py-1 rounded font-medium transition-colors duration-150 ${
            isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"
          }`
        }
      >
        Orders
      </NavLink>

      <NavLink
        to="/customers"
        end
        className={({ isActive }) =>
          `px-3 py-1 rounded font-medium transition-colors duration-150 ${
            isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"
          }`
        }
      >
        Customers
      </NavLink>
    </div>
  );
}

export default Nav;
