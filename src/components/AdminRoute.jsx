import React from "react";
import ToolTip from "./ToolTip";
const AdminRoute = ({ icon, text, handleClick, className, collapse }) => {
  return (
    <div
      onClick={handleClick}
      className={`flex w-full  cursor-pointer space-x-5    ${className} items-baseline  py-3 h-fit  `}
    >
      {collapse ? (
        <ToolTip tooltip={text}>
          <button className="bg-transparent text-white  rounded">
            <i className={`fa-solid ${icon} mr-2 `}></i>
          </button>
        </ToolTip>
      ) : (
        <>
          <i className={`fa-solid ${icon}  `}></i>
          <p
            className={`text-lg origin-left transition-opacity duration-300 whitespace-nowrap  ${
              collapse && "scale-0"
            } `}
          >
            {text}
          </p>
        </>
      )}
    </div>
  );
};

export default AdminRoute;
