import React from "react";

const DeliverTypeList = ({ name, title, price, footer, checked, onChange }) => {
  return (
    <div className="flex space-x-3">
      <div className="mt-1">
        <input
          id={name}
          name={name}
          type="radio"
          checked={checked}
          onChange={onChange}
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <p className="flex items-center text-slate-400">
            {title}
            <span className="font-bold text-lg ml-2 text-white ">
              ${price}.00
            </span>
          </p>
        </div>
        <div className="mt-2 text-sm text-slate-300">
          <p>Est. delivery:Jun 21 – Jul 20</p>
        </div>
        <div className="font-semibold text-blue-400 mt-1  text-sm">
          <p>{footer}</p>
        </div>
      </div>
    </div>
  );
};

export default DeliverTypeList;
