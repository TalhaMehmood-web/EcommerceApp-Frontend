import React from "react";
import AdminRoute from "./AdminRoute";
import { useNavigate, useLocation } from "react-router-dom";
const SideBar = ({ className, setOpenModel, handleCollapse, collapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminSideBarRoutes = [
    {
      icon: "fa-house",
      text: "Dashboard",
      route: "/admin/dashboard",
    },
    {
      icon: "fa-briefcase",
      text: "Add Product",
      route: "/admin/add-product",
    },
    {
      icon: "fa-briefcase",
      text: "All Products",
      route: "/admin/all-products",
    },
    {
      icon: "fa-user",
      text: "Customers",
      route: "/admin/customers",
    },
    {
      icon: "fa-vector-square",
      text: "Orders",
      route: "/admin/orders",
    },
    {
      icon: "fa-message",
      text: "Chats",
      route: "/admin/chats",
    },
  ];
  const collapseColor = collapse
    ? "bg-blue-600/20 text-blue-600"
    : "text-slate-200";
  return (
    <div
      style={{
        zIndex: "1",
      }}
      className={` ${className} flex flex-1 flex-col  py-2      border-r border-[#19203591]`}
    >
      <div className="flex flex-1 lg:flex-[0.92] flex-col justify-around  space-y-3 border-b border-slate-700  items-baseline">
        {adminSideBarRoutes?.map((item, index) => (
          <AdminRoute
            collapse={collapse}
            key={index + item.route}
            icon={item?.icon}
            text={item?.text}
            handleClick={() => {
              navigate(item.route);
              setOpenModel && setOpenModel(false);
            }}
            className={` transition-all duration-300 ease-in-out hover:text-blue-500 ${
              location.pathname === item.route
                ? " text-blue-600 bg-blue-600/20"
                : ` text-slate-200  `
            } px-5`}
          />
        ))}
      </div>
      <div
        onClick={handleCollapse}
        className={` hidden lg:flex  flex-[0.08] items-center w-full space-x-5 px-5 cursor-pointer hover:text-blue-600   duration-300 ${collapseColor}`}
      >
        <i
          className={`fa-solid ${
            collapse ? "fa-arrow-right-long" : "fa-arrow-left-long"
          }  text-lg`}
        ></i>
        <p
          className={`text-lg  whitespace-nowrap ${
            collapse ? " hidden" : " block"
          }`}
        >
          Collapse View
        </p>
      </div>
    </div>
  );
};

export default SideBar;
