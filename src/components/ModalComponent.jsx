import React from "react";
import Modal from "react-modal";
import FormInput from "./FormInput";
import Button from "./Button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { postData } from "../api/PostData";
const ModalComponent = ({ isModelOpen, setIsModalOpen, productId, top }) => {
  const form = useForm({
    defaultValues: {
      quantity: 1,
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const queryClient = useQueryClient();
  const addToCartMutation = useMutation(
    (quantity) => {
      return postData(`customer/cart/${productId}`, { quantity });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("product");
        queryClient.refetchQueries("carts");
        queryClient.refetchQueries("wishlists");
      },
    }
  );
  const onSubmit = async (data) => {
    setIsModalOpen(false);
    const cartAdded = await addToCartMutation.mutateAsync(
      Number(data?.quantity)
    );
    if (cartAdded) {
      toast.success(`${data?.quantity} quantity added to cart `);
    }
  };
  return (
    <Modal
      style={{
        content: {
          width: "25rem",
          height: "fit-content",
          display: "flex",
          alignItems: "start",
          position: "absolute",
          top: `${top + 20}px`,
          left: "68%",
          backgroundColor: "#1E293B",
          border: "2px solid #334155",
          boxShadow: "2px 2px 2px #334155, -2px -2px -2px #334155",
          color: "white",
        },
        overlay: {
          background: "transparent",
        },
      }}
      isOpen={isModelOpen}
      onRequestClose={() => setIsModalOpen(false)}
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col justify-start"
      >
        <p className="text-3xl font-semibold text-center my-2">Update CART </p>
        <FormInput
          type={"number"}
          label={" Quantity"}
          id="quantity"
          placeholder={"Enter the Product Quantity"}
          error={errors?.quantity?.message}
          {...register("quantity", {
            min: { value: 1, message: "Quantity must be at least 1  " },
          })}
        />
        <Button
          type={"submit"}
          title={"Confirm "}
          className={
            "px-3 py-2 bg-green-600 rounded-md  w-full flex justify-center hover:bg-green-700 focus:bg-green-700 "
          }
        />
      </form>
    </Modal>
  );
};

export default ModalComponent;
