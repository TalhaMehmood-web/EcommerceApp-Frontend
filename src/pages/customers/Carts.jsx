import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchData } from "../../api/FetchData";
import { CARTS_TABLE as cart_table } from "../../utils/CustomData";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { deleteData } from "../../api/DeleteData";
import Modal from "react-modal";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import FormInput from "../../components/FormInput";
import { updateData } from "../../api/updateData";
const Carts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [modalTop, setModalTop] = useState(0);
  const form = useForm({
    defaultValues: {
      quantity: 1,
    },
  });
  const { handleSubmit, register, formState } = form;
  const { isLoading, data } = useQuery(
    "carts",
    () => fetchData("customer/carts"),
    {
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );
  // console.log(data);
  const { errors } = formState;

  // mutations
  // 1. delete cart mutation
  const deleteCartMutation = useMutation(
    (cartId) => {
      return deleteData(`customer/cart/${cartId}`);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("carts");
        queryClient.refetchQueries("all-products");
        queryClient.refetchQueries("wishlists");
      },
    }
  );
  // 2. edit cart mutation
  const editCartMutation = useMutation(
    (quantity) => {
      return updateData(`customer/cart/${selectedCart}`, { quantity });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("carts");
        queryClient.refetchQueries("product");
        queryClient.refetchQueries("wishlists");
      },
    }
  );
  // handlers
  //1. delete cart handler
  const deleteCart = async (cartId) => {
    try {
      const deleted = await deleteCartMutation.mutateAsync(cartId);
      if (deleted) {
        toast.success("Cart Deleted Successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //2. edit cart handler
  const editCart = (e, cartId) => {
    setIsModalOpen(true);
    setSelectedCart(cartId);
    const pos = e.target.getBoundingClientRect();
    setModalTop(pos.top);
  };
  const onSubmit = async (data) => {
    setIsModalOpen(false);
    const cartUpdated = await editCartMutation.mutateAsync(
      Number(data?.quantity)
    );
    if (cartUpdated) {
      toast.success("Cart Quantity Updated Successfully");
    }
  };
  const proceedToCheckOut = (cartId) => {};
  return (
    <div className="flex flex-1 overflow-x-hidden p-4 flex-col ">
      {isLoading ? (
        <div className="flex flex-1 justify-center items-center w-full">
          <PropagateLoader size={20} color="#36d7b7" />
        </div>
      ) : (
        <>
          <p className="text-4xl my-4 ">
            Carts <span className="text-slate-300  ">({data?.totalCarts})</span>
          </p>
          {data?.carts?.length > 0 ? (
            <div className=" w-full overflow-auto scroll">
              <table className="w-full table-auto scroll border border-slate-600">
                <thead>
                  <tr className=" ">
                    {cart_table?.map((header, index) => (
                      <th
                        className={`py-2 text-[12px] text-slate-400 px-3  tracking-wider whitespace-nowrap ${
                          header?.field === "productTitle"
                            ? "text-start"
                            : "text-center"
                        } `}
                        key={index + header?.head}
                      >
                        {header?.head?.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {data?.carts?.map((cart, index) => (
                    <tr
                      className={`${
                        index % 2 === 0 ? "bg-slate-700" : "bg-transparent"
                      } `}
                      key={cart?._id}
                    >
                      {cart_table?.map((header, index) => (
                        <td
                          className={`px-3 border-r border-slate-600 text-sm whitespace-nowrap ${
                            header?.field === "productTitle"
                              ? "text-start text-blue-400 hover:underline cursor-pointer"
                              : "text-center"
                          }`}
                          key={index + cart?._id + header?.head}
                        >
                          {header.field === "picture" ? (
                            <img
                              className="w-12 h-12 mx-auto object-cover"
                              src={cart[header?.field]}
                              alt=""
                            />
                          ) : header.field !== "productTitle" ? (
                            <p>{cart[header?.field]}</p>
                          ) : (
                            <p
                              onClick={() =>
                                navigate(
                                  `/customer/product-detail/${cart?.productId}`
                                )
                              }
                            >
                              {cart[header?.field]}
                            </p>
                          )}

                          {header.field === "delete-icon" && (
                            <i
                              onClick={() => deleteCart(cart?._id)}
                              className="fa-solid fa-trash text-lg text-red-500 hover:scale-125 transition-all ease-linear cursor-pointer"
                            ></i>
                          )}
                          {header.field === "edit-icon" && (
                            <i
                              onClick={(e) => editCart(e, cart?._id)}
                              className="fa-solid fa-edit text-lg text-blue-500 hover:scale-125 transition-all ease-linear cursor-pointer"
                            ></i>
                          )}
                          {/* {header.field === "checkout" && (
                            <Button
                              type={"button"}
                              onClick={() => proceedToCheckOut(cart?._id)}
                              title={"Add to Checkout"}
                              className={
                                "bg-indigo-600 hover:bg-indigo-500 focus:bg-indigo-500 px-2 py-1 whitespace-nowrap rounded-md text-[10px] font-semibold mx-auto"
                              }
                            />
                          )} */}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-1 justify-center items-center text-3xl font-semibold text-slate-200">
              No items in your shopping cart.
            </div>
          )}
        </>
      )}
      <Modal
        style={{
          content: {
            width: "25rem",
            height: "fit-content",
            display: "flex",
            alignItems: "start",
            position: "absolute",
            top: `${modalTop + 20}px`,
            left: "70%",
            backgroundColor: "#1E293B",
            border: "2px solid #334155",
            boxShadow: "2px 2px 2px #334155, -2px -2px -2px #334155",
            color: "white",
          },
          overlay: {
            background: "transparent",
          },
        }}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-start"
        >
          <p className="text-2xl font-semibold text-center my-2">Edit Cart</p>
          <FormInput
            type={"number"}
            label={" Quantity"}
            id="quantity"
            placeholder={"Enter the Product Quantity"}
            error={errors?.quantity?.message}
            {...register("quantity", {
              min: { value: 1, message: "Quantity must be at least 1" },
            })}
          />
          <Button
            type={"submit"}
            title={"Update "}
            className={
              "px-3 py-2 bg-yellow-600 rounded-md  w-full flex justify-center hover:bg-yellow-700 focus:bg-yellow-700 "
            }
          />
        </form>
      </Modal>
    </div>
  );
};

export default Carts;
