import React from "react";

const GlobalFilter = ({ filter, setFilter, placeHolder }) => {
  return (
    <div className=" flex w-full flex-[0.5] my-3 items-center ">
      <label htmlFor="search">Search:-</label>
      <input
        type="search"
        placeholder={placeHolder || "Search Products.."}
        className="border  max-w-md flex flex-1 ml-3 border-slate-700 rounded-md outline-none px-2 py-2 focus:border-blue-600 bg-transparent "
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
};

export default GlobalFilter;
