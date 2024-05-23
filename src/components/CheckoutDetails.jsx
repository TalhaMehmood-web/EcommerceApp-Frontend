import React from "react";
import CheckoutDetailList from "./CheckoutDetailList";
import { useNavigate } from "react-router-dom";
const CheckoutDetails = ({ data, header, isEditBtn }) => {
  const navigate = useNavigate();
  const array = [
    {
      field: "name",
      icon: "fa-user",
      label: "Full Name",
    },
    {
      field: "address",
      icon: "fa-home",
      label: "Address",
    },
    {
      field: "phoneNumber",
      icon: "fa-phone",
      label: "Phone Number",
    },
  ];

  return (
    <div className="flex flex-col w-full  py-4  sm:p-4 my-3 border-b border-slate-700 ">
      <div className="flex items-center space-x-3">
        <p className="text-3xl font-semibold">{header}</p>
        {isEditBtn && (
          <span
            onClick={() => navigate("/customer/shipping-info")}
            className=" text-sm text-blue-500 underline hover:text-blue-600 cursor-pointer"
          >
            {data === undefined ? "Fill Out Form" : "Edit"}
          </span>
        )}
      </div>
      <div className="flex flex-col w-full mt-6 space-y-5">
        {array?.map((item, index) => (
          <CheckoutDetailList
            key={index}
            icon={item?.icon}
            label={item.label}
            field={data?.[item?.field]}
          />
        ))}
      </div>
    </div>
  );
};

export default CheckoutDetails;
