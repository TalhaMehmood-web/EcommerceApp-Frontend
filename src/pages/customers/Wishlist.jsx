import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchData } from "../../api/FetchData";
import toast from "react-hot-toast";
import { WISHLIST_TABLE_DATA as table_data } from "../../utils/CustomData";
import { deleteData } from "../../api/DeleteData";
import Skeleton from "react-loading-skeleton";
import WishListCard from "../../components/WishListCard";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../components/ModalComponent";

const Wishlist = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buttonTop, setButtonTop] = useState(0);

  const pageSize = 5;
  const navigate = useNavigate();
  //  fetch wishlist query
  const { data, isLoading } = useQuery(
    ["wishlists", currentPage],
    () =>
      fetchData(`customer/wishlist?page=${currentPage}&pageSize=${pageSize}`),
    {
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );

  // mutations
  // 1. delete WishList mutation
  const deleteWishlistMutation = useMutation(
    (productId) => deleteData(`customer/wishlist/${productId}`),
    {
      onSuccess: () => {
        queryClient.refetchQueries("wishlists");
        queryClient.refetchQueries("all-products");
      },
    }
  );

  // handlers
  // 1.  delete from wishlist handler
  const handleDelete = async (id) => {
    const deleted = await deleteWishlistMutation.mutateAsync(id);
    if (deleted) {
      toast.success("Product deleted from wishlist");
    }
  };
  // 2. add to cart handler
  const addToCart = async (e, productId) => {
    const pos = e.target.getBoundingClientRect();
    setButtonTop(pos.top);
    setIsModalOpen(true);
    setSelectedProduct(productId);
  };
  const totalPages = Math.ceil(data?.totalItems / pageSize);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {data?.items?.length === 0 ? (
        <p className="flex items-center justify-center flex-1 text-3xl font-semibold">
          Wishlist Is empty
        </p>
      ) : (
        <div className="flex flex-col flex-1 p-4">
          <p className="my-4 text-4xl">
            WishList{" "}
            {!isLoading && (
              <span className="text-slate-400">({data?.totalItems})</span>
            )}
          </p>
          <div className="overflow-y-hidden overflow-x-auto scroll w-full  h-[340px]  md:block hidden ">
            <table className="w-full  py-2">
              <thead className="border-y border-slate-700">
                <tr>
                  {table_data?.map((item, index) => (
                    <th
                      key={index}
                      className={`px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                        (item.field === "title" || true) && "text-start"
                      }`}
                    >
                      {item.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-slate-700">
                {isLoading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        {table_data?.map((item, rowIndex) => {
                          return (
                            <td className="px-2" key={rowIndex + index}>
                              <Skeleton
                                width={
                                  item.field === "picture"
                                    ? 60
                                    : item.field === "title"
                                    ? 200
                                    : 100
                                }
                                height={item.field === "picture" ? 40 : 30}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {data?.items?.map((item, index) => (
                      <tr
                        key={index}
                        className={`divide-x h-fit divide-slate-700 ${
                          index % 2 === 0 ? "bg-slate-700/50" : "bg-transparent"
                        }`}
                      >
                        {table_data?.map((header, headerIndex) => (
                          <td
                            key={headerIndex}
                            className={`p-1 h-fit whitespace-nowrap text-sm ${
                              (header.field === "icon" ||
                                typeof item.product[header.field] ===
                                  "number" ||
                                header.field === "categoryTitle") &&
                              "text-center"
                            }`}
                          >
                            {header.field === "title" ? (
                              <p
                                onClick={() =>
                                  navigate(
                                    `/customer/product-detail/${item?.product?._id}`
                                  )
                                }
                                className="text-blue-400 cursor-pointer hover:underline"
                              >
                                {" "}
                                {item.product[header.field]
                                  .split(" ")
                                  .slice(0, 10)
                                  .join(" ") + "...."}
                              </p>
                            ) : header.field === "picture" ? (
                              <img
                                className="object-contain w-12 h-12 p-1 mx-auto border rounded-md border-slate-700"
                                src={item?.product?.picture}
                                alt="product_img"
                              />
                            ) : header.field === "icon" ? (
                              <i
                                onClick={() => handleDelete(item?.product?._id)}
                                className="text-center text-red-500 cursor-pointer fa-solid fa-trash hover:text-red-600 hover:scale-125 hover:shadow-xl hover:shadow-red-400"
                              ></i>
                            ) : header.field === "button" ? (
                              <button
                                onClick={(e) =>
                                  addToCart(e, item?.product?._id)
                                }
                                className="text-[10px] flex items-center justify-center w-fit mx-auto cursor-pointer bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 px-2 py-2 rounded-md"
                              >
                                <i className="mr-2 fa-solid fa-cart-shopping"></i>
                                <p>Add to Cart</p>
                              </button>
                            ) : (
                              item.product[header.field]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {
            <div className="block md:hidden">
              {data?.items?.map(({ product }) => (
                <WishListCard
                  key={product?._id}
                  title={product?.title}
                  picture={product?.picture}
                  salesPrice={product?.salesPrice}
                  regularPrice={product?.regularPrice}
                  addToCart={(e) => addToCart(e, product?._id)}
                />
              ))}
            </div>
          }
          <div className="flex justify-between w-full py-1 border-y border-slate-700 ">
            <div></div>
            <div className="flex items-center">
              <button
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                }
                disabled={currentPage === 1}
                className="rounded-md cursor-pointer hover:bg-slate-700/70 focus:bg-slate-700/70 bg-slate-700/30"
              >
                <i className="px-3 py-2 transition-all duration-300 ease-in-out border border-transparent fa-solid fa-chevron-left"></i>
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`border border-transparent transition-all duration-300 ease-in-out hover:bg-blue-500 focus:bg-blue-500 rounded-md px-4 py-1 ${
                    currentPage === index + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                  key={index}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prevPage) =>
                    Math.min(prevPage + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="rounded-md cursor-pointer hover:bg-slate-700/70 focus:bg-slate-700/70 bg-slate-700/30"
              >
                <i className="px-3 py-2 transition-all duration-300 ease-in-out border border-transparent fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
      <ModalComponent
        top={buttonTop}
        productId={selectedProduct}
        isModelOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Wishlist;
