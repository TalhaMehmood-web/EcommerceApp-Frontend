import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchData } from "../api/FetchData";
import { useNavigate } from "react-router-dom";
const ShippingTable = ({
  cartItems,
  setCartItems,
  shippingCost,
  totalPrice,
  setTotalPrice,
}) => {
  const { isLoading, data: carts } = useQuery(
    "carts",
    () => fetchData("customer/carts"),
    {
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );
  const navigate = useNavigate();
  const [itemsPrice, setItemsPrice] = useState(0);
  useEffect(() => {
    if (carts && carts?.carts) {
      let totalPrice = 0;
      carts?.carts?.forEach((cart) => {
        if (cartItems?.some((item) => item?.cartId === cart?._id)) {
          totalPrice += cart?.totalPrice;
        }
      });
      setItemsPrice(totalPrice);
    }
    setTotalPrice(shippingCost + itemsPrice);
  }, [cartItems, carts, shippingCost, itemsPrice]);
  const handleChange = (cartId, cartQuantity, createdBy) => {
    const fullCart = {
      cartId,
      cartQuantity,
      createdBy,
    };
    setCartItems((prev) => {
      const exists = prev.some((item) => item.cartId === cartId);
      if (exists) {
        return prev.filter((item) => item.cartId !== cartId);
      } else {
        return [...prev, fullCart];
      }
    });
  };

  return (
    <div className="flex flex-col flex-1 p-2 h-fit">
      <div className="flex flex-col flex-1 mb-2 ">
        <div>
          <p className="text-2xl font-bold text-center border-b border-slate-700 py-2">
            Summary
          </p>
        </div>
        {carts?.carts?.length === 0 ? (
          <p className="h-[10rem] flex justify-center items-center text-xl border-b border-slate-700 font-semibold">
            {" "}
            No items is your Carts{" "}
          </p>
        ) : (
          <>
            {" "}
            {carts?.carts?.map((cart) => (
              <div
                className="flex items-center  space-x-4 border-b py-2 border-slate-700 "
                key={cart?._id}
              >
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={cartItems?.some(
                    (item) => item?.cartId === cart?._id
                  )}
                  onChange={() =>
                    handleChange(cart?._id, cart?.quantity, cart?.createdBy)
                  }
                />
                <img
                  src={cart?.picture}
                  alt={cart?.productTitle}
                  className="w-12 h-12 object-cover border p-1 border-slate-700 rounded-md"
                />
                <p
                  onClick={() =>
                    navigate(`/customer/product-detail/${cart?.productId}`)
                  }
                  className="flex flex-[1] text-[14px] text-blue-400 cursor-pointer hover:underline hover:text-blue-500 "
                >
                  {cart?.productTitle.split(" ").slice(0, 7).join(" ")}...
                </p>
                <p className="mx-auto text-[13px] flex flex-[0.2] justify-center items-center ">
                  x{cart?.quantity}
                </p>
                <p className="flex flex-[0.2] justify-center ">
                  ${cart?.totalPrice}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="flex flex-col space-y-3 px-3 pt-3">
        <div className="flex text-slate-300 items-center justify-between w-full">
          <p className="text-lg  font-semibold">Items SubTotal:</p>
          <p> $ {itemsPrice} </p>
        </div>
        <div className="flex text-slate-300 items-center justify-between w-full">
          <p className="text-lg  font-semibold">Shipping Cost:</p>
          <p> $ {shippingCost} </p>
        </div>
        <div className="flex text-white pt-2 text-2xl items-center border-t border-slate-700 justify-between w-full">
          <p className=" font-semibold">Total Amount :</p>
          <p> $ {totalPrice} </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingTable;
