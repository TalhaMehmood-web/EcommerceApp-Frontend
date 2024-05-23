import React from "react";

const Spinner = ({ loadingColor }) => {
  return (
    <div
      className={`w-8 h-8 rounded-full border-b-[2px] border-r-[2px]  ${loadingColor}  relative animate-spin`}
    ></div>
  );
};

export default Spinner;
