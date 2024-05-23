import React from "react";
import { CUSTOMER_ROUTES as routes } from "../utils/CustomData";
import { useNavigate, useLocation } from "react-router-dom";
import FormSelect from "./FormSelect";
const CustomerRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 lg:py-1 border-y border-slate-700 bg-slate-700 ">
      <div
        onClick={() => navigate(-1)}
        className="lg:flex flex-[0.2] justify-center text-lg font-semibold cursor-pointer hidden"
      >
        <button className="border border-slate-500 p-2 flex justify-center items-center rounded-full bg-slate-600 hover:bg-slate-800 focus:bg-slate-800">
          <i className="fa-solid fa-arrow-left-long"></i>
        </button>
      </div>
      <div className="flex flex-1 lg:flex-[0.6]  items-center justify-between lg:space-x-0 space-x-7 text-sm font-semibold overflow-auto scroll ">
        {routes?.map((route, index) => (
          <p
            onClick={() => navigate(route.navigate)}
            className={`cursor-pointer hover:text-blue-600 transition-all duration-300 ease-in-out whitespace-nowrap 
            ${
              location.pathname.includes(route.navigate)
                ? "text-blue-600"
                : "text-slate-300"
            }
            `}
            key={route + index}
          >
            {route?.title}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CustomerRoutes;
