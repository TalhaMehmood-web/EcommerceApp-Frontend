import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchData } from "../../api/FetchData";
import { postData } from "../../api/PostData";
import Button from "../../components/Button";
import Skeleton from "react-loading-skeleton";
import { PRODUCT_DETAILS_DATA as DescArr } from "../../utils/CustomData";
import toast from "react-hot-toast";
import ProductRatingModal from "../../components/ProductRatingModal";
import Rating from "../../components/Rating";
import { useSocketContext } from "../../context/SocketContext";
const ProductDetail = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("description");
  const [reviews, setReviews] = useState([]);
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  const { data: product, isLoading } = useQuery(
    ["product", productId],
    () => fetchData(`customer/product/${productId}`),
    {
      staleTime: Infinity,
      refetchOnMount: false,
    }
  );
  const { data: updatedReviews } = useQuery(
    ["reviews", productId],
    () => fetchData(`customer/reviews/${productId}`),
    {
      staleTime: Infinity,
      refetchOnMount: false,
    }
  );
  useEffect(() => {
    socket?.on("review", (review) => {
      queryClient.setQueryData(["reviews", productId], (prevData) => {
        return [review, ...prevData];
      });
    });
    return () => {
      socket?.off("review");
    };
  }, [updatedReviews, queryClient, socket]);

  const addToCartMutation = useMutation(
    (productId) => {
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
  const addToCart = async (productId) => {
    const { data } = await addToCartMutation.mutateAsync(productId);
    if (data) {
      toast.success(`${quantity} quantity added to cart `);
    }
  };
  return (
    <div
      style={{
        height: "calc(100vh - 115px)",
      }}
      className="flex flex-col flex-1 bg-slate-800 overflow-auto scroll pb-4"
    >
      <div className="flex flex-col flex-1 justify-around px-12 py-4 space-y-4 lg:flex-row md:space-y-0 md:space-x-6 md:container md:mx-auto ">
        <div className="flex flex-col items-center justify-between">
          <div>
            {isLoading ? (
              <Skeleton
                highlightColor="#334155"
                height={520}
                width={500}
                baseColor=" #64748B"
                className="mb-2"
              />
            ) : (
              <img
                className="object-contain border h-[95%] rounded-md shadow-sm border-slate-700 bg-slate-900/40 shadow-sky-800"
                src={product?.picture}
                alt=""
              />
            )}
          </div>
          <div className="flex  justify-around w-full lg:mb-0 mb-4  space-x-4">
            <Button
              title={"Add to Wishlist"}
              className={
                "bg-transparent lg:w-full w-fit   whitespace-nowrap justify-center border border-[#E5780B] text-[#E5780B]  rounded-full px-6 py-2 text-base hover:text-white  hover:bg-[#E5780B]  "
              }
              icon={"fa-heart mr-2"}
            />
            <Button
              title={"Add to Cart"}
              className={
                "bg-[#E5780B] whitespace-nowrap w-fit lg:w-full justify-center border border-[#E5780B] text-white  rounded-full px-6 py-2 text-base  hover:bg-[#e5780bde]  "
              }
              icon={"fa-cart-shopping mr-2"}
              onClick={() => addToCart(product?._id)}
            />
          </div>
        </div>
        <div className=" flex flex-1 ">
          <div className="border  flex flex-1 flex-col justify-around p-3 border-slate-700 rounded-md shadow-md shadow-sky-900 bg-slate-900/40 ">
            <div className="flex items-center my-2 space-x-3">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i
                    key={index}
                    className="fa-solid mx-[1px] fa-star text-yellow-500 text-sm"
                  ></i>
                ))}
              </div>
              <p className="text-blue-500 ">6548 People rated and reviewed</p>
            </div>
            <p className="text-3xl font-bold text-slate-100">
              {isLoading ? (
                <>
                  <Skeleton />
                  <Skeleton width={400} />
                </>
              ) : (
                <> {product?.title}</>
              )}
            </p>
            <div className="flex items-center my-3 space-x-3">
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <Skeleton width={120} height={20} />
                  <Skeleton width={120} height={20} />
                </div>
              ) : (
                <>
                  <p className="text-5xl italic font-semibold">
                    ${product?.regularPrice}.00
                  </p>
                  <del className="text-2xl font-normal text-slate-300 ">
                    ${product?.salesPrice}.00
                  </del>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold">
                Available Stock | {product?.stockQuantity} Units |
              </p>
              <p
                className={` ${
                  product?.stockQuantity > 0
                    ? "bg-green-400/20  text-green-500"
                    : " bg-red-400/20  text-red-500"
                } px-2  rounded-md `}
              >
                {product?.stockQuantity > 0 ? "In Stock" : "Out Of Stock"}
              </p>
            </div>
            <div className="flex items-center my-2">
              <p className="text-2xl">
                Vendor |{" "}
                <span className="text-lg text-blue-500">{product?.vendor}</span>{" "}
              </p>
            </div>
            <div className="flex flex-col my-2 space-y-2">
              <span className="text-lg font-semibold text-slate-300">
                Quantity :
              </span>
              <div className="flex items-center space-x-3">
                <Button
                  disabled={quantity === 1}
                  onClick={() => setQuantity((prev) => prev - 1)}
                  icon={"fa-minus  "}
                  className={
                    "text-base focus:bg-slate-700 text-blue-400 border border-slate-700 rounded-md px-3 py-2 "
                  }
                />
                <p className="text-center w-[2rem]">{quantity}</p>
                <Button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  icon={"fa-plus "}
                  className={
                    "text-base focus:bg-slate-700 text-blue-400 border border-slate-700 rounded-md px-3 py-2"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container flex flex-col mx-auto  space-y-4 ">
        <div className="flex py-3 space-x-3 border-y border-slate-700 ">
          {DescArr?.map((item, index) => {
            return (
              <p
                onClick={() => setDescription(item.route)}
                className={`text-sm font-semibold cursor-pointer py-2    ${
                  item.route === description
                    ? "text-sky-500 line  "
                    : "text-slate-400"
                } `}
                key={index}
              >
                {item.title}
              </p>
            );
          })}
        </div>
        <div className="flex justify-between lg:flex-row flex-col w-full">
          <div className="flex  flex-1 lg:flex-[0.6] ">
            {description === "description" && (
              <p className="font-normal">{product?.description}</p>
            )}
            {description === "ratings" && (
              <div className="flex flex-1 flex-col p-3 bg-slate-900/30 shadow-xl shadow-slate-900">
                <ProductRatingModal
                  setReviews={setReviews}
                  originalData={updatedReviews}
                />
                <div>
                  {updatedReviews?.map((review) => (
                    <Rating
                      key={review._id}
                      ratings={review.rating}
                      customerId={review.reviewedBy._id}
                      customer={review.reviewedBy.fullname}
                      picture={review.reviewedBy.picture}
                      date={review.createdAt}
                      comment={review.comment}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="right flex-1 flex lg:flex-[0.3] border h-fit">
            right
          </div>
        </div>
      </div>
      {/* <div className="container py-2 mx-auto  border-slate-700">slider</div> */}
    </div>
  );
};

export default ProductDetail;
