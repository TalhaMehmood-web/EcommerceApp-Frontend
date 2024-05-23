import React, { useEffect, useState } from "react";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { inventoryArray } from "../../utils/CustomData";
import axios from "../../utils/AxiosConfiq";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchData } from "../../api/FetchData";
import { deliveryArray } from "../../utils/CustomData";
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  //loading state
  const [progress, setProgress] = useState(0);
  // inventory state for conditional rendering
  const [inventory, setInventory] = useState("Pricing");
  // categories state
  const [addCategory, setAddCategory] = useState(false);
  const [country, setCountry] = useState("");
  const queryClient = useQueryClient();
  //tags states
  const [tags, setTags] = useState([]);
  const [singleTag, setSingleTag] = useState("");
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  let [shippingType, setShippingType] = useState(false);
  const [deliverType, setDeliverType] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [offer, setOffer] = useState("");
  const [vendor, setVendor] = useState("");
  const [collections, setCollections] = useState("");
  const navigate = useNavigate();
  // mutations and queries
  const { data: categories } = useQuery(
    "categories",
    () => fetchData("admin/category"),
    {
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );
  const categoryMutation = useMutation(
    async (category) => {
      const { data } = await axios.post("admin/category", {
        name: category,
      });
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
      },
    }
  );
  const productMutation = useMutation(
    async (productData) => {
      setProgress(20);
      try {
        productData = new FormData();
        productData.append("title", title);
        productData.append("description", description);
        productData.append("productPicture", picture);
        productData.append("category", category);
        productData.append("shippingType", shippingType);
        productData.append("deliveryType", deliverType);
        productData.append("offer", offer);
        productData.append("vendor", vendor);
        productData.append("regularPrice", regularPrice);
        productData.append("salesPrice", salesPrice);
        productData.append("stockQuantity", stockQuantity);
        productData.append("collections", collections);
        productData.append("tags", tags);
        setProgress(50);
        const { data } = await axios.post("admin/product", productData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProgress(90);
        if (data) {
          navigate("/admin/all-products");
          toast.success("Product Published Successfully");
        }
      } catch (error) {
        setProgress(0);
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("products");
      },
    }
  );

  const handleCategory = async (e) => {
    if (e.key === "Enter" && category.trim() === "") {
      toast.error("Kindle type category and press enter");
      return;
    }
    if (e.key === "Enter" && category.trim() !== "") {
      try {
        const data = await categoryMutation.mutateAsync(category);
        if (data) {
          console.log(data);
          setAddCategory(false);
          toast.success(` ${category} Added to Categories `);
          setCategory("");
        }
      } catch (error) {
        toast.error("Network Error");
      }
    }
  };
  const handleTagSubmit = (e) => {
    if ((e.key === "Enter" || e.key === ".") && singleTag !== "") {
      if (tags.length >= 3) {
        toast.error("Maximum three tags are allowed");
        return;
      } else {
        setTags((prev) => [...prev, singleTag]);
        setSingleTag("");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      title,
      description,
      picture,
      category,
      regularPrice,
      salesPrice,
      shippingType:
        shippingType === "true"
          ? (shippingType = true)
          : (shippingType = false),
      stockQuantity,
      deliverType:
        deliverType === "Selected Countries" && country !== ""
          ? country
          : deliverType,
      tags,
      vendor,
      collections,
      offer,
    };
    await productMutation.mutateAsync(productData);
  };
  return (
    <div
      style={{
        height: "calc(100vh - 130px)",
      }}
      className="flex flex-1 overflow-y-scroll scroll flex-col bg-[#0F111A]  "
    >
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col ">
        <div
          style={{ width: `${progress}%` }}
          className=" h-1 bg-green-400 transition-all ease-linear rounded-xl"
        ></div>
        <div className="flex flex-1 flex-col p-4">
          <div className="my-3 w-full flex sm:flex-row flex-col sm:space-y-0 space-y-4 justify-between">
            <div>
              <p className="text-4xl font-semibold">Add a product</p>
              <p className="text-base font-semibold text-slate-400">
                Orders placed across your store
              </p>
            </div>
            <div className="flex items-end space-x-4 ">
              <button className="border border-slate-400 text-sm font-semibold rounded-md px-5 py-2 hover:bg-slate-600/60 bg-transparent text-slate-300 ">
                Discard
              </button>
              <Button
                type={"submit"}
                className={" hover:bg-blue-600 bg-blue-500 text-white"}
                title={"Add Product"}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col lg:flex-row space-y-4 lg:space-x-4 mt-3">
            <div className="flex flex-col flex-[0.7]">
              <FormInput
                label={"Product Title"}
                labelStyles={"text-2xl"}
                type={"text"}
                id={"title"}
                placeholder={"Product Title here.."}
                value={title}
                handleChange={(e) => setTitle(e.target.value)}
              />

              <div className="w-full ">
                <label
                  className="text-2xl font-semibold text-slate-100 "
                  htmlFor="product-description"
                >
                  Product Description
                </label>
                <textarea
                  required
                  id="description"
                  rows={6}
                  className="bg-[#141824] mt-3 w-full border border-[#19203591] rounded-lg focus:border-blue-600 outline-none p-3 "
                  placeholder="Product Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="w-full flex flex-col mt-2 ">
                <label
                  className="text-2xl font-semibold text-slate-100 mb-2"
                  htmlFor="images"
                >
                  Display Images
                </label>
                <input
                  required
                  type="file"
                  name="productPicture"
                  id="productPicture"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setPicture(file);
                  }}
                  className="border border-[#19203591] cursor-pointer focus:border-blue-600 rounded-lg p-2"
                />
              </div>
              <div className="flex flex-col flex-1  ">
                <p className={"text-2xl font-semibold text-slate-100 my-4"}>
                  Inventory
                </p>
                <div className="flex flex-1 sm:flex-row flex-col border-y border-[#19203591]  ">
                  <div className="flex sm:flex-col  flex-row    flex-[0.3] border-r border-[#19203591]">
                    {inventoryArray?.map((item, index) => (
                      <div
                        onClick={() => setInventory(item.title)}
                        className={`flex flex-1 text-sm transition-all duration-300 ease-in-out  items-center justify-center sm:justify-start px-4 py-3 space-x-3 border-b border-[#19203591] cursor-pointer 
                    ${
                      inventory === item?.title
                        ? "text-white bg-slate-600"
                        : "text-slate-300"
                    }
                    `}
                        key={item.title + index}
                      >
                        <i className={`fa-solid ${item.icon}`}></i>
                        <p className="hidden sm:block"> {item.title}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-[0.6] p-4">
                    {inventory === "Pricing" && (
                      <div className="flex flex-1 flex-col ">
                        <FormInput
                          label={"Regular Price"}
                          labelStyles={
                            "text-base text-slate-200 font-semibold my-2"
                          }
                          type={"number"}
                          placeholder={"$$$"}
                          id={"regularPrice"}
                          value={regularPrice}
                          handleChange={(e) => setRegularPrice(e.target.value)}
                        />
                        <FormInput
                          label={"Sales Price"}
                          labelStyles={
                            "text-base text-slate-200 font-semibold my-2"
                          }
                          type={"number"}
                          placeholder={"$$$"}
                          id={"salesPrice"}
                          value={salesPrice}
                          handleChange={(e) => setSalesPrice(e.target.value)}
                        />
                      </div>
                    )}
                    {inventory === "Restock" && (
                      <div className="flex flex-1 flex-col">
                        <FormInput
                          label={"Add To Stock"}
                          labelStyles={
                            "text-base text-slate-200 font-semibold my-2"
                          }
                          type={"number"}
                          placeholder={"$$$"}
                          id={"stockQuantity"}
                          value={stockQuantity}
                          handleChange={(e) => setStockQuantity(e.target.value)}
                        />
                        <div className="flex justify-center items-center">
                          <Button
                            title={"Confirm"}
                            className={
                              "w-fit   bg-blue-600 hover:bg-blue-600/70 focus:bg-blue-600/90"
                            }
                          />
                        </div>
                      </div>
                    )}
                    {inventory === "Shipping" && (
                      <div className="flex flex-1 flex-col justify-between">
                        <p className="font-semibold text-lg">Shipping Type</p>
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="shippingType"
                            id="shippingType"
                            className="cursor-pointer my-2"
                            value={false}
                            onChange={(e) => setShippingType(e.target.value)}
                          />

                          <div className="text-sm text-slate-400 px-2 ">
                            <p className="text-lg font-normal my-1">
                              Fulfilled by Seller
                            </p>
                            <p>
                              You’ll be responsible for product delivery. <br />
                              Any damage or delay during shipping may cost you a
                              Damage fee.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="shippingType"
                            id="shippingType"
                            className="cursor-pointer my-2"
                            value={true}
                            onChange={(e) => setShippingType(e.target.value)}
                          />

                          <div className="text-sm text-slate-400 px-2 ">
                            <p className="text-lg font-normal my-1">
                              Fulfilled by Phoenix
                            </p>
                            <p>
                              Your product, Our responsibility.
                              <br />
                              For a measly fee, we will handle the delivery
                              process for you.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {inventory === "Global Delivery" && (
                      <div>
                        <p className="text-lg font-semibold text-slate-200">
                          Global Delivery
                        </p>
                        <div>
                          {deliveryArray?.map((item, index) => {
                            return (
                              <div key={index + item.render} className="my-3">
                                <input
                                  type="radio"
                                  name="deliveryType"
                                  id="deliveryType"
                                  className="mr-2 cursor-pointer"
                                  value={deliverType}
                                  onChange={() => {
                                    setDeliverType(item.title);
                                    setCountry("");
                                  }}
                                />
                                <label htmlFor="world-wide">{item.title}</label>
                                {item.render === "FormInput" ? (
                                  <FormInput
                                    placeholder={"Type Country Name"}
                                    id={"country-name"}
                                    value={country}
                                    required={false}
                                    handleChange={(e) =>
                                      setCountry(e.target.value)
                                    }
                                  />
                                ) : (
                                  <div className="flex text-sm text-slate-400">
                                    <p>{item?.render}</p>
                                    <span className="underline ml-1 text-blue-400 cursor-pointer hover:no-underline hover:text-blue-500">
                                      {item?.span !== null && item?.span}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-[0.3]  flex-col h-fit  ">
              <div className="flex flex-1 flex-col h-fit">
                <div className="border border-[#19203591] rounded-lg flex flex-1 flex-col p-4 bg-[#141824] ">
                  <p className="text-white text-xl font-semibold mb-4">
                    Organize
                  </p>
                  <div className="flex flex-col mb-4">
                    <label
                      className="text-base text-slate-200 font-semibold my-2"
                      htmlFor="category"
                    >
                      Category
                      <span
                        onClick={() => {
                          setAddCategory(true);
                          setCategory("");
                        }}
                        className="text-sm font-semibold cursor-pointer hover:underline text-blue-400 hover:text-blue-500 ml-3"
                      >
                        Add New Category
                      </span>
                    </label>
                    {addCategory ? (
                      <FormInput
                        value={category}
                        handleChange={(e) => setCategory(e.target.value)}
                        type={"text"}
                        id={"category"}
                        placeholder={"Type a category"}
                        className={"mb-0"}
                        onKeyDown={handleCategory}
                      />
                    ) : (
                      <select
                        className="bg-slate-800 p-2 rounded-md outline-none focus:border-blue-600 border border-[#19203591] focus:shadow-md focus:shadow-blue-700 cursor-pointer"
                        name="category"
                        required
                        id="category"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                        }}
                      >
                        <option disabled value="">
                          Select a category
                        </option>
                        {categories?.length !== 0 &&
                          categories?.map((category) => (
                            <option key={category?._id} value={category?.name}>
                              {category?.name?.charAt(0).toUpperCase() +
                                category?.name?.slice(1)}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>

                  <FormInput
                    label={"Vendor"}
                    placeholder={"Enter Vendor Name"}
                    value={vendor}
                    handleChange={(e) => setVendor(e.target.value)}
                    id={"vendor"}
                    type={"text"}
                  />
                  <FormInput
                    type={"text"}
                    id={"collections"}
                    labelStyles={"text-base text-slate-200 font-semibold my-2"}
                    placeholder={"Collections"}
                    label={"Collections"}
                    value={collections}
                    handleChange={(e) => setCollections(e.target.value)}
                  />
                  {tags.length > 0 && (
                    <div className="flex mb-2">
                      {tags.map((tag, index) => (
                        <div
                          className={`${
                            index !== 0 && "mx-2"
                          } border border-slate-700 px-2 py-[0.5px] rounded-md `}
                          key={tag + index}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                  <FormInput
                    label={"Tags"}
                    placeholder={"Add maximum 3 tags"}
                    value={singleTag}
                    handleChange={(e) => setSingleTag(e.target.value)}
                    onKeyDown={handleTagSubmit}
                    required={false}
                  />

                  <FormInput
                    type={"number"}
                    id={"offer"}
                    labelStyles={"text-base text-slate-200 font-semibold my-4"}
                    placeholder={"Offer in percentage"}
                    label={"Offer"}
                    value={offer}
                    handleChange={(e) => setOffer(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
