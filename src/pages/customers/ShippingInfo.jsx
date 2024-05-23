import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import FormInput from "../../components/FormInput";
import { useForm } from "react-hook-form";
import FormSelect from "../../components/FormSelect";
import Button from "../../components/Button";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { postData } from "../../api/PostData";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const ShippingInfo = () => {
  const [cities, setCities] = useState([]);
  const [fetchingCities, setFetchingCities] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();
  // form states
  const form = useForm({
    defaultValues: {
      fullName: `${user?.fullname || ""}`,
      email: `${user?.email || ""}`,
      phoneNumber: "",
      address: {
        addressLineOne: "",
        addressLineTwo: "",
      },
      location: { country: "Afghanistan", city: "Select city", postalCode: "" },
    },
  });
  const { handleSubmit, register, formState, getValues } = form;
  const { errors } = formState;
  const { data } = useQuery(
    "countries",
    async () => {
      try {
        const { data } = await axios.get(
          "https://countriesnow.space/api/v0.1/countries"
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
    }
  );
  // fetching cities of a specific country
  const citiesMutation = useMutation(
    async (country) => {
      try {
        const { data } = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/cities",
          { country }
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    {
      onMutate: () => {
        setFetchingCities(true);
        toast.success("Fetching Cities");
      },
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("countries");
        setFetchingCities(false);
        setCities(data);
      },
    }
  );
  // change handler for input type select of id country
  const handleChange = async () => {
    const selectedCountry = getValues("location.country");
    const { data } = await citiesMutation.mutateAsync(
      selectedCountry.toLowerCase()
    );
    if (data) {
      setFetchingCities(false);
      setCities(data);
    }
  };
  // posting data  network call
  const submitDataMutation = useMutation(
    (data) => {
      return postData(`customer/shipping-info`, data);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("shipping-info");
      },
    }
  );
  const countries = data?.data.map((detail) => detail?.country);
  // submit handler
  const onSubmit = async (data) => {
    try {
      const mutationData = await submitDataMutation.mutateAsync(data);
      if (mutationData) {
        toast.success("Shipping Info Added");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div
      style={{
        height: "calc(100vh - 115px)",
      }}
      className="container  overflow-y-scroll scroll   flex flex-col justify-center  flex-1 p-3 mx-auto lg:flex-row "
    >
      <div className="flex flex-[0.95] flex-col  p-2">
        <p className="text-3xl font-semibold text-slate-100 ">Shipping Info</p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label={"Full Name"}
            type={"text"}
            id={"fullName"}
            placeholder={"john Doe"}
            className={"mt-3"}
            error={errors?.fullName?.message}
            {...register("fullName", {
              required: "Name is required",
            })}
          />

          <div className="flex space-x-4">
            <FormInput
              label={"Email"}
              id={"email"}
              type={"email"}
              placeholder={"example@gmail.com"}
              className={"mt-3"}
              error={errors?.email?.message}
              {...register("email", {
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Invalid email format",
                },
                required: {
                  value: true,
                  message: "Email is required",
                },
              })}
            />

            <FormInput
              label={"Phone Number"}
              placeholder={"phone number"}
              type={"tel"}
              id={"phoneNumber"}
              className={"mt-3"}
              error={errors?.phoneNumber?.message}
              {...register("phoneNumber", {
                required: {
                  value: true,
                  message: "Phone Number is Required",
                },
              })}
            />
          </div>
          <FormInput
            label={"Address Line 1"}
            placeholder={"address 1"}
            type={"text"}
            id={"addressLineOne"}
            className={"mt-3"}
            error={errors?.address?.addressLineOne?.message}
            {...register("address.addressLineOne", {
              required: {
                value: true,
                message: "Address One is Required",
              },
            })}
          />
          <FormInput
            label={"Address Line 2"}
            placeholder={"address 2"}
            type={"text"}
            id={"addressLineTwo"}
            className={"mt-3"}
            {...register("address.addressLineTwo")}
          />
          <div className="flex items-center space-x-3">
            <FormSelect
              id={"country"}
              label={"Select Country"}
              options={countries}
              placeholder={"Select a country"}
              error={errors?.location?.country?.message}
              {...register("location.country", {
                onChange: handleChange,
                required: {
                  value: true,
                  message: "Select a country!",
                },
              })}
            />

            <FormSelect
              id={"city"}
              label={"Select City/Region"}
              options={cities}
              loading={fetchingCities}
              error={errors?.location?.city?.message}
              placeholder={"Select a city"}
              {...register("location.city", {
                required: {
                  value: true,
                  message: "Select a City !",
                },
              })}
            />
            <FormInput
              label={"Zip/Postal Code"}
              placeholder={"zip/postal code"}
              className={"mt-3"}
              type={"text"}
              id={"postalCode"}
              error={errors?.location?.postalCode?.message}
              {...register("location.postalCode", {
                required: {
                  value: true,
                  message: "Postal Code is Required",
                },
              })}
            />
          </div>
          <Button
            type={"submit"}
            title={"Save"}
            className={
              "bg-blue-600  px-6 py-[8px] w-full hover:bg-blue-700 flex justify-center  focus:bg-blue-700 rounded-md  text-center"
            }
          />
        </form>
      </div>
    </div>
  );
};

export default ShippingInfo;
