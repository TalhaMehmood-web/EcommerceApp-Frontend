import React from "react";

const WishListCard = ({
  picture,
  title,
  salesPrice,
  regularPrice,
  addToCart,
}) => {
  return (
    <div className="border p-3 flex space-x-2 border-slate-700 shadow-md  shadow-slate-700  rounded-md">
      <img
        className="w-32  h-full bg-slate-700   object-cover"
        src={picture && picture}
        alt=""
      />

      <div className="flex flex-1 flex-col justify-between ">
        <div className="text-blue-500 hover:underline ms:text-base text-sm">
          {title?.split(" ").slice(0, 10).join(" ")}...
        </div>
        <div className="flex flex-col  ms:space-y-0 space-y-4 mt-2 ms:mt-0 ms:flex-row ms:items-center ms:justify-between">
          <div className="flex  space-x-3 items-center ms:justify-start justify-between">
            <del className="text-slate-400">
              ${regularPrice && regularPrice}.00
            </del>
            <p className=" text-2xl ms:text-4xl text-green-500 font-semibold">
              ${salesPrice && salesPrice}.00
            </p>
          </div>
          <div className="flex items-center ms:justify-start justify-between space-x-3">
            <button
              onClick={addToCart}
              className="text-[10px] flex items-center justify-center w-fit  cursor-pointer bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 px-2 py-2 rounded-md"
            >
              <i className="fa-solid fa-cart-shopping mr-2"></i>
              <p>Add to Cart</p>
            </button>
            <i className="fa-solid fa-trash text-center hover:text-red-600 cursor-pointer text-red-500 hover:scale-125 hover:shadow-xl hover:shadow-red-400"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishListCard;
