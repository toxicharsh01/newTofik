import React, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_LOCAL_API;

const CountOrder = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api = `${BASE_URL}/tofik/orders/count`;
    const fetchCounts = async () => {
      try {
        const res = await axios.get(api);
        setCounts(res.data.totalsByGrams);
      } catch (err) {
        console.error("Error fetching counts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 bg-gray-100 rounded-lg shadow-md">
        <p className="text-gray-500 font-medium">Loading counts...</p>
      </div>
    );
  }

  if (!counts || Object.keys(counts).length === 0) {
    return (
      <div className="flex justify-center items-center h-32 bg-gray-100 rounded-lg shadow-md">
        <p className="text-red-500 font-medium">Unable to load counts.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap justify-center items-start gap-4 p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md">
      {Object.keys(counts).map((gram) => {
        const total = counts[gram].mintPacks + counts[gram].normalPacks;
        return (
          <div
            key={gram}
            className="flex-1 min-w-[140px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] max-w-[300px] bg-white p-3 sm:p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold text-indigo-700 text-center mb-1 sm:mb-2">
              {gram}g Packs
            </h3>
            <p className="text-gray-700 text-center text-sm sm:text-base font-semibold">
              Thandai: {counts[gram].mintPacks}
            </p>
            <p className="text-gray-700 text-center text-sm sm:text-base font-semibold">
              Sada: {counts[gram].normalPacks}
            </p>
            <p className="text-indigo-600 font-bold text-center text-sm sm:text-base mt-1 sm:mt-2">
              Total: {total}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CountOrder;
