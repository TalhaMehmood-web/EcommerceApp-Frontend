import React from "react";

const CheckoutDetailList = ({ field, icon, label }) => {
  return (
    <div className="flex space-x-2 mt-  w-full items-center">
      <div className="flex  flex-1  sm:flex-[0.7] lg:flex-[0.3] space-x-2 items-center ">
        <div>
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <p className="flex flex-1  sm:flex-[0.8] justify-start font-semibold text-slate-100 text-lg whitespace-nowrap">
          {label}
        </p>
        <span className="text-lg font-bold sm:block hidden ">:</span>
      </div>
      <div className="flex flex-1 justify-start items-start sm:flex-[0.7]  lg:flex-[0.3] text-slate-300  ">
        {field ? <p className="whitespace-nowrap">{field}</p> : `your ${label}`}
      </div>
    </div>
  );
};

export default CheckoutDetailList;
