import React, { useEffect, useState } from "react";
import CheckoutDetails from "../../components/CheckoutDetails";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchData } from "../../api/FetchData";
import { postData } from "../../api/PostData";
import DeliverTypeList from "../../components/DeliverTypeList";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import { DELIVERY_OPTIONS } from "../../utils/CustomData";
import { PAYMENT_OPTIONS } from "../../utils/CustomData";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import years, { months } from "../../utils/GenerateYears";
import ShippingTable from "../../components/ShippingTable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Checkout = () => {
  const { data: userData } = useQuery(
    "shipping-info",
    () => fetchData("customer/shipping-info"),
    {
      staleTime: Infinity,
      refetchOnMount: false,
    }
  );
  // console.log(userData);

  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const [deliveryType, setDeliveryType] = useState("Free Shipping");
  const [shippingCost, setShippingCost] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const checkoutMutation = useMutation(
    (data) => {
      return postData("customer/checkout", data);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("carts");
        queryClient.refetchQueries("orders");
        toast.success("Order Placed Successfully");
        setCartItems([]);
      },
    }
  );
  const onSubmit = async (data) => {
    if (userData === undefined || userData === null) {
      toast.error("Fill out Shipping Info First");
      return;
    }
    data.shippingCost = shippingCost;
    data.deliveryType = deliveryType;
    data.carts = cartItems;
    if (cartItems.length === 0) {
      toast.error("Select at least one cart item", {
        position: "bottom-left",
      });
      return;
    }
    const checkout = await checkoutMutation.mutateAsync(data);
    if (checkout) {
      navigate(`/customer/invoice/${checkout?.data?._id}`);
    }
  };
  const handleChange = (type, cost) => {
    setDeliveryType(type);
    setShippingCost(cost);
  };
  return (
    <div
      style={{
        height: "calc(100vh - 115px)",
      }}
      className="flex flex-col flex-1 overflow-auto scroll "
    >
      <div className="flex flex-col flex-1 p-3">
        <p className="my-2 text-4xl font-semibold text-slate-100">Checkout</p>
        <div className="flex flex-col justify-between flex-1 xl:flex-row">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-[0.9] lg:flex-[0.6] flex-col  p-4"
          >
            <CheckoutDetails
              data={userData}
              header={"Shipping Address"}
              isEditBtn={true}
            />
            <CheckoutDetails
              data={userData}
              header={"Billing Address"}
              isEditBtn={false}
            />
            <div className="p-4 border-b border-slate-700">
              <p className="text-3xl font-semibold text-slate-100">
                Deliver Type
              </p>
              <div className="grid grid-cols-1 gap-4 mt-2 justify-items-start md:grid-cols-2">
                {DELIVERY_OPTIONS?.map((item, index) => (
                  <DeliverTypeList
                    key={index + item?.name}
                    name={item?.name}
                    title={item?.title}
                    price={item?.price}
                    footer={item?.footer}
                    checked={deliveryType === item?.title}
                    onChange={() => handleChange(item?.title, item?.price)}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 border-b border-slate-700">
              <p className="my-2 text-3xl font-semibold text-slate-100">
                Payment Method
              </p>
              <div className="flex items-center space-x-3">
                <FormSelect
                  label={"Select Card"}
                  id={"cardType"}
                  options={PAYMENT_OPTIONS}
                  placeholder={"Select A Card"}
                  error={errors?.cardType?.message}
                  {...register("cardType", {
                    required: {
                      value: true,
                      message: "Kindly select card type",
                    },
                  })}
                />
                <FormInput
                  label={"Card Number"}
                  type={"number"}
                  id={"cardNumber"}
                  error={errors?.cardNumber?.message}
                  placeholder={"4444 4444 4444 4444"}
                  {...register("cardNumber", {
                    required: {
                      value: true,
                      message: "Enter a card number",
                    },
                  })}
                />
              </div>
              <FormInput
                label={"Card Holder Name"}
                type={"text"}
                id={"cardHolderName"}
                placeholder={"Full Name"}
                className={"my-2"}
                {...register("cardHolderName")}
              />
              <div className="flex items-center mt-4 space-x-3">
                <FormSelect
                  label={"Select Expiry Month"}
                  id={"expiryMonth"}
                  options={months}
                  sort={false}
                  placeholder={"Select Month"}
                  {...register("expiryMonth")}
                />
                <FormSelect
                  label={"Select Expiry Year"}
                  id={"expiryYear"}
                  options={years}
                  placeholder={"Select Year"}
                  sort={false}
                  {...register("expiryYear")}
                />
                <FormInput
                  label={"CVC Number"}
                  type={"text"}
                  id={"CVC"}
                  placeholder={"Enter a valid CVC"}
                  error={errors?.CVC?.message}
                  {...register("CVC", {
                    required: {
                      value: true,
                      message: "CVC number is required",
                    },
                    pattern: {
                      value: /^[0-9]{3,4}$/,
                      message: "Enter a valid CVC Number",
                    },
                  })}
                />
              </div>
            </div>
            <Button
              type={"submit"}
              title={`Pay $${totalPrice}`}
              className={
                "bg-blue-600 p-2 flex justify-center w-full rounded-md "
              }
            />
          </form>
          <div className="flex flex-[0.36] border border-slate-700 rounded-md h-fit">
            <ShippingTable
              cartItems={cartItems}
              setCartItems={setCartItems}
              shippingCost={shippingCost}
              totalPrice={totalPrice}
              setTotalPrice={setTotalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
