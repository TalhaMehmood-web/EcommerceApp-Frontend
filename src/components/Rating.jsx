import React from "react";
import { formatTimestamp } from "../utils/DateConvert";
import { useUser } from "../context/UserContext";
const Rating = ({ ratings, customer, picture, date, comment, customerId }) => {
  const { user } = useUser();
  return (
    <div className="border my-2 p-3 border-slate-700 rounded-md flex w-full  justify-between ">
      <div className=" flex flex-[0.85] flex-col space-y-3">
        <div className="flex items-center space-x-1">
          {Array.from({ length: ratings }).map((item, index) => (
            <i key={index} className="fa-solid text-yellow-400 fa-star"></i>
          ))}
          <p>
            by{" "}
            <span className="font-bold text-lg">
              {user?._id === customerId ? "You" : customer}
            </span>{" "}
          </p>
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-light">{formatTimestamp(date)}</p>
          <p>{(ratings * 20).toFixed(2)}% satisfied</p>
        </div>
        <div>
          <p>{comment}</p>
        </div>
      </div>
      <div className="flex flex-[0.19] justify-end items-center">
        <img
          className="w-20 h-20 object-cover rounded-full"
          src={picture}
          alt={customer}
        />
      </div>
    </div>
  );
};

export default Rating;
