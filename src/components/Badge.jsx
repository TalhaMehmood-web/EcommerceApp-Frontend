import React from "react";

const Badge = ({ text }) => {
  return (
    <span className="inline-flex animate-pulse items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-green-600 rounded-full">
      {text}
    </span>
  );
};

export default Badge;
